import { cookies } from "next/headers";
import { COOKIE_TOKEN } from "@/constants";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

export const validateCokkieToken = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get(COOKIE_TOKEN);
  if (!user?.value) {
    throw new Error("UNAUTHORIZED");
  }
  return user.value;
};

export const writeImage = (fileName: string, buffer: Buffer) => {
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.join(currentDir, fileName);

  // On some systems (especially on Mac/Linux), the pathname may start with "/"
  const normalizedPath = path.resolve(filePath);
  try {
    fs.writeFileSync(normalizedPath, buffer);
    return { success: true, path: normalizedPath };
  } catch (err) {
    console.error("Error writing file:", err);
    return { error: "Failed to write file" };
  }
};

export async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

const jwtSecret = process.env.SUPABASE_JWT_SECRET || "";

export function generateJwtToken(walletAddress: string) {
  const payload = {
    sub: walletAddress.toLowerCase(),
    role: "authenticated",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // expires in 24h
  };
  return jwt.sign(payload, jwtSecret);
} 