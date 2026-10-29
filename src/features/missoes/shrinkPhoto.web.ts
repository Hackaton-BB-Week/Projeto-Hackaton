// Só na web: a câmera devolve a foto inteira em base64 (vários MB), e o álbum é
// salvo no localStorage do navegador (limite de ~5 MB). Reduz para no máximo 800 px
// e JPEG 60%, o que dá dezenas de KB. Se algo falhar, devolve a original.
const MAX_SIDE = 800;
const QUALITY = 0.6;

export async function shrinkPhoto(uri: string): Promise<string> {
  try {
    const img = new Image();
    img.src = uri;
    await img.decode();
    const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * k);
    canvas.height = Math.round(img.naturalHeight * k);
    const ctx = canvas.getContext('2d');
    if (!ctx) return uri;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', QUALITY);
  } catch {
    return uri;
  }
}
