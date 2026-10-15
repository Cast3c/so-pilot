import { UnrecoverableError, Worker } from "bullmq";
import { createRedisConnection, PUBLISH_QUEUE } from "@/lib/queue";
import { markTargetFailed, publishTargetById } from "@/lib/publish";
import { ProviderError } from "@/lib/providers";

const worker = new Worker<{ targetId: number }>(
  PUBLISH_QUEUE,
  async (job) => {
    try{
      await publishTargetById(job.data.targetId)
    }
    catch (error){
      if(error instanceof ProviderError && (error.kind === "auth" || error.kind === "validation")){
        throw new UnrecoverableError(error.message);
      }
      throw error;
    }
  },
  { connection: createRedisConnection(), concurrency: 3 }
);

worker.on("completed", (job) => {
  console.log(`[worker] target ${job.data.targetId} published`);
});

worker.on("failed", async (job, error) => {
  if (!job) return;
  const maxAttempts = job.opts.attempts ?? 1;
  console.error(
    `[worker] target ${job.data.targetId} failed (attempt ${job.attemptsMade}/${maxAttempts}): ${error.message}`
  );
  
  const isFinal = job.attemptsMade >= maxAttempts || error instanceof UnrecoverableError;
  if (isFinal) {
    await markTargetFailed(job.data.targetId, error.message);
  }
});

worker.on("error", (error) => {
  console.error("[worker] error:", error.message);
});

console.log("[worker] waiting for jobs...");

async function shutdown() {
  await worker.close();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
