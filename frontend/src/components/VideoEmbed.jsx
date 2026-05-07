function parseVideo(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v");
      if (id) return { type: "youtube", id };
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return { type: "youtube", id };
    }
    if (host === "youtube.com" && u.pathname.startsWith("/embed/")) {
      return { type: "youtube", id: u.pathname.split("/")[2] };
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (/^\d+$/.test(id)) return { type: "vimeo", id };
    }
    if (host === "player.vimeo.com") {
      const id = u.pathname.split("/").pop();
      if (/^\d+$/.test(id)) return { type: "vimeo", id };
    }
    if (u.protocol === "https:" || u.protocol === "http:") {
      if (/\.(mp4|webm|ogg)(\?|$)/i.test(u.pathname)) {
        return { type: "file", src: url };
      }
    }
  } catch { /* fall-through */ }
  return null;
}

export default function VideoEmbed({ url, className = "", title = "Vídeo" }) {
  const v = parseVideo(url);
  if (!v) return null;

  const wrapper = `relative w-full aspect-video overflow-hidden rounded-xl bg-black ${className}`;

  if (v.type === "youtube") {
    return (
      <div className={wrapper}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${v.id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }
  if (v.type === "vimeo") {
    return (
      <div className={wrapper}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://player.vimeo.com/video/${v.id}?dnt=1`}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }
  return (
    <div className={wrapper}>
      <video className="absolute inset-0 w-full h-full object-cover" controls preload="metadata" src={v.src} />
    </div>
  );
}

export { parseVideo };
