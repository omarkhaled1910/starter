import { cookies } from "next/headers";
import { COOKIE_TOKEN } from "@/constants";
import path from "path";
import fs from "fs";

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
