// Utilidad compartida (cliente y servidor): normaliza una URL de YouTube
// (youtu.be o watch?v=) a su URL de embed, preservando la lista si la hay.
export function youtubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const list = u.searchParams.get("list");
    let id = "";
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else {
      id = u.searchParams.get("v") ?? u.pathname.split("/embed/")[1] ?? "";
    }
    if (!id) return url;
    return `https://www.youtube.com/embed/${id}${list ? `?list=${list}` : ""}`;
  } catch {
    return url;
  }
}
