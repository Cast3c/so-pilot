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

export async function schedulePublish(postId: number, runAt: Date) {
    const delay = Math.max(0, runAt.getTime() - Date.now());

    await getPublishQueue().add(
        "publish",
        { postId },
        {
            delay,
            jobId: `post-${postId}`,
            attempts: 3,
            backoff: { type: "exponential", delay: 30_000 },
            removeOnComplete: true,
            removeOnFail: 100,
        }
    );
}