import { createClient } from "@/lib/supabase/client";

export const useSignedBucketUrl = (bucketName: string, path: string) => {
  const getSignedUrls = (names: string[]): Promise<any[]> => {
    const supabase = createClient();

    // Use Promise.all to handle multiple signed URL generations
    return Promise.all(
      names.map((name) =>
        supabase.storage
          .from(bucketName)
          .createSignedUrl(name, 60 * 60 * 24 * 30)
          .then(({ data, error }) => {
            if (error) {
              console.error("Error creating signed URL for", name, error);
              return null; // or handle error as needed
            }
            return data;
          })
          .catch((err) => {
            console.error("Unexpected error for", name, err);
            return null;
          })
      )
    );
  };

  // Return the promise for use elsewhere
  return {
    getSignedUrls,
  };
};
