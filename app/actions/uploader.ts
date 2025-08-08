import { createClient } from "@/lib/supabase/server";

export async function uploadBinaryToSupabase(
  fileBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  const supabase = await createClient();

  console.log(fileName, "fileName");
  let url = "";
  const bucketName = "erc";
  await Promise.all(
    [1].map(async (file) => {
      const { error, data } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          contentType: "image/bmp",
          upsert: true,
        });
      console.log(data, "data");

      const { data: signedUrl, error: signedUrlError } = await supabase.storage
        .from(bucketName) // your private bucket
        .createSignedUrl(fileName, 60); // URL valid for 60 seconds
      url = signedUrl?.signedUrl || "";
      if (error) {
        console.error("Supabase upload error:", error);
        return null;
      }
      // console.log(responses, "responses");

      //   if (error) {
      //     return { name: file.name, message: error.message }
      //   } else {
      //     return { name: file.name, message: undefined }
      //   }
    })
  );

  console.log(url, "url");
  return url;
}
