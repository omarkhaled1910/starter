import { useSignedUrl } from "@/hooks/use-signed-url";
import React from "react";

const NftImage = ({
  image_url,
  className,
  height,
  width,
}: {
  image_url: string;
  className?: string;
  height?: number;
  width?: number;
}) => {
  const data = image_url.split("/sign/")[1].split("?token")[0];
  const path = data.split("/");

  const { signedUrl, loading, error } = useSignedUrl({
    bucket: path[0],
    path: path[1],
    expiresInSeconds: 600, // 10 minutes
  });

  if (loading) return <p>Loading image...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <img
      height={height}
      width={width || "100%"}
      className={className}
      src={signedUrl ?? ""}
      alt="Private NFT Sprite"
    />
  );
};

export default NftImage;
