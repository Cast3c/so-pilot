import { createHmac, timingSafeEqual } from "node:crypto";

type SignedRequestPayload = {
    algorithm?: string;
    user_id?: string;
    issued_at?: number;
}

export function parseSignedRequest(signedRequest: string, appSecret: string){
    const [encodedSignature, payload] = signedRequest.split(".", 2);
    if(!encodedSignature || !payload) return null;

    const expected = createHmac("sha256", appSecret).update(payload).digest();
    const received = Buffer.from(encodedSignature, "base64url");

    if(received.length !== expected.length) return null;
    if(!timingSafeEqual(received, expected)) return null;

    const data = JSON.parse(
        Buffer.from(payload, "base64url").toString("utf8")
    ) as SignedRequestPayload;

    return data.algorithm === "HMAC-SHA256" ? data : null;
}