import { createClient } from "@/lib/supabase/server";

export async function uploadBMPToSupabase(
  fileBuffer: Buffer,
  fileName: string
): Promise<string | null> {
  const supabase = await createClient();

  //   const { data, error } = await supabase.storage
  //     .from("images") // Your bucket name
  //     .upload(fileName, fileBuffer, {
  //       contentType: "image/bmp",
  //       upsert: true,
  //     });

  const responses: any = await Promise.all(
    [1].map(async (file) => {
      const { error } = await supabase.storage
        .from("erc")
        .upload(fileName, fileBuffer, {
          contentType: "image/bmp",
          upsert: true,
        });
      if (error) {
        console.error("Supabase upload error:", error);
        return null;
      }
      console.log(responses);
      return responses;

      //   if (error) {
      //     return { name: file.name, message: error.message }
      //   } else {
      //     return { name: file.name, message: undefined }
      //   }
    })
  );

  //
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
  return publicUrl;
}
