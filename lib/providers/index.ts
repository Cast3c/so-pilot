export * from "./types";
export * from "./errors";

import type { ProviderId, SocialProvider }from "./types";
import { threadsProvider } from "./threads";

const registry = new Map<ProviderId, SocialProvider>();
registry.set("threads", threadsProvider);

export function getProvider(id: ProviderId): SocialProvider{
    const provider = registry.get(id);
    if(!provider) throw new Error(`No hay adaptador registrado para "${id}"`);
    return provider;
}

export function listProviders(): SocialProvider[] {
    return [...registry.values()];
}

