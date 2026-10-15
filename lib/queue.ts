import { Queue } from "bullmq";
import IORedis from "ioredis";

export const PUBLISH_QUEUE = "publish-post";

export function createRedisConnection() {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set.")
    return new IORedis(url, { maxRetriesPerRequest: null });
}

let queue: Queue | undefined;

function getPublishQueue() {
    queue ??= new Queue(PUBLISH_QUEUE, {
        connection: createRedisConnection()
    });
    return queue;
}

export async function schedulePublishTarget(targetId: number, runAt: Date) {
    const delay = Math.max(0, runAt.getTime() - Date.now());

    await getPublishQueue().add(
        "publish",
        { targetId },
        {
            delay,
            jobId: `target-${targetId}`,
            attempts: 3,
            backoff: { type: "exponential", delay: 30_000 },
            removeOnComplete: true,
            removeOnFail: 100,
        }
    );
}

export async function cancelPublishTarget(targetId: number) {
    try {
        const job = await getPublishQueue().getJob(`target-${targetId}`);
        await job?.remove();
    } catch (error) {
        // The database is the source of truth: the worker skips cancelled targets.
        console.error("[queue] could not remove job for target", targetId, error);
    }
}