import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function getKey() {
    const key = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY!, "base64");
    if(key.length !== 32) {
        throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes in base64");
    }
    return key;
}

export function encrypt(plain: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
    const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [iv, tag, data].map((b) => b.toString("base64")).join(".");
}

export function decrypt(payload: string) {
    const [iv, tag, data] = payload
        .split(".")
        .map((part) => Buffer.from(part, "base64"));
        const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}