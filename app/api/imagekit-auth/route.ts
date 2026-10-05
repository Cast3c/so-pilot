import { auth } from "@clerk/nextjs/server";
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
    await auth.protect();

    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        publicKey,
    });

    return Response.json({ token, expire, signature, publicKey });
}