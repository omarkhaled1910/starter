// useSignedUrl.ts
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zohslegwhpqjtfyadnok.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // use env vars in production

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Options = {
  bucket: string;
  path: string;
  expiresInSeconds?: number;
};

export const useSignedUrl = ({
  bucket,
  path,
  expiresInSeconds = 3600,
}: Options) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSignedUrl = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresInSeconds);

      console.log(data, error, bucket, path);

      if (error) {
        setError(error.message);
        setSignedUrl(null);
      } else {
        setSignedUrl(data?.signedUrl || null);
      }

      setLoading(false);
    };

    getSignedUrl();
  }, [bucket, path, expiresInSeconds]);

  return { signedUrl, loading, error };
};
