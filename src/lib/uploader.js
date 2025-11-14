export async function uploadImages(files, baseUrl) {
  const url = `${baseUrl.replace(/\/$/, '')}/upload`;
  const form = new FormData();
  for (const f of files) form.append('files', f);
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Error al subir imágenes');
  const data = await res.json();
  return data.urls || [];
}
