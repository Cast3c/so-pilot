import { Worker } from "bullmq";
import { createRedisConnection, PUBLISH_QUEUE } from "@/lib/queue";
import { markPostFailed, publishPostById } from "@/lib/publish";

const worker = new Worker<{ postId: number }>(
  PUBLISH_QUEUE,
  async (job) => {
    await publishPostById(job.data.postId);
  },
  { connection: createRedisConnection(), concurrency: 3 }
);

worker.on("completed", (job) => {
  console.log(`[worker] post ${job.data.postId} published`);
});

worker.on("failed", async (job, error) => {
  if (!job) return;
  const maxAttempts = job.opts.attempts ?? 1;
  console.error(
    `[worker] post ${job.data.postId} failed (attempt ${job.attemptsMade}/${maxAttempts}): ${error.message}`
  );
  if (job.attemptsMade >= maxAttempts) {
    await markPostFailed(job.data.postId, error.message);
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
