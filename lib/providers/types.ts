export type ProviderId = "threads" | "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok";

export type MediaInput = {
    url: string;
    type: "IMAGE" | "VIDEO"; 
};

export type PublishInput = {
    text: string;
    media: MediaInput[];
}

export type PublishResult = {
    externalId: string;
    permalink?: string;
};

export interface ProviderCapabilities {
    id: ProviderId;
    label: string;
    maxTextLength: number;
    media: {
        allowed: MediaInput["type"][];
        required: boolean;
        maxItems: number;
    };
};

export interface SocialProvider {
    capabilities: ProviderCapabilities;
    publish(account: {externalId: string; accessToken: string;}, input: PublishInput): Promise<PublishResult>;
}
