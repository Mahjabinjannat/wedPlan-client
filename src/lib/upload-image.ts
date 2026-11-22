// ==========================================
// UPLOAD IMAGE TO IMGBB
// ==========================================
// Sends one image file to our /api/upload-image route,
// which uploads it to ImgBB and returns the image URL.
// Use only in client components ("use client").

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.url) {
    throw new Error(result.message ?? "Image upload failed.");
  }

  return result.url as string;
}
