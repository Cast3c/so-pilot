export type ErrorClass = "auth" | "validation" | "rate_limit" | "transient" | "unknown";

export class ProviderError extends Error {
    constructor(
        public readonly kind: ErrorClass,
        message: string,
        public readonly raw?: unknown,
    ) {
        super(message);
        this.name= "ProviderError";
    }
}