
// lib/upload.ts
export async function uploadFile(
  file: File,
  type?: "video" | "audio" | "image",
  onProgress?: (progress: { loaded: number; total: number }) => void
): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  let endpoint = '/api/upload';
  if (type === 'video') {
    endpoint = '/api/upload/videos';
  } else if (type === 'audio') {
    endpoint = '/api/upload/audios';
    formData.append('type', type);
  } else if (type === 'image') {
    endpoint = '/api/upload/images';
    formData.append('type', type);
  }


  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(30000) // Timeout après 30s
  });

  if (!response.ok) {
    const errorData: any = await response.json();
    throw new Error(errorData.error || 'Upload failed');
  }

  return await response.json() as any;
}