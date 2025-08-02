"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";

const FileUploader = ({
  onUploadFinalize,
}: {
  onUploadFinalize: (successes: string[]) => void;
}) => {
  const props = useSupabaseUpload({
    bucketName: "erc",
    path: "erc",
    allowedMimeTypes: ["image/*"],
    maxFiles: 2,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  return (
    <div className="">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent
          onUploadFinalize={(stuff: string[]) => {
            console.log("uploaded", stuff);
            onUploadFinalize(stuff);
          }}
        />
      </Dropzone>
    </div>
  );
};

export default FileUploader;
