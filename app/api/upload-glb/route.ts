// pages/api/upload-glb.ts
import { uploadBinaryToSupabase } from "@/app/actions/uploader";
import { streamToBuffer } from "@/lib/serverUtils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // required for Buffer support in App Router

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  console.log("file type:", typeof file);
  console.log("file instanceof Blob:", file instanceof Blob);
  console.log("file.constructor.name:", file?.constructor?.name);
  console.log(file);
  console.log(file, "file");
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileBuffer = await streamToBuffer(file.stream());

  const fileName = `models/${Date.now()}-${file.name}`;

  const url = await uploadBinaryToSupabase(fileBuffer, fileName); // this will work for any binary

  if (!url) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({ url });
}
