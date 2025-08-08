import { apiFetch } from "@/apiFetch";

export const upload3D = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log(formData, "formData");
  try {
    const res = await fetch("/api/upload-glb", {
      method: "POST",
      body: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
    });

    return await res.json();
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to upload 3D model",
    };
  }
};
