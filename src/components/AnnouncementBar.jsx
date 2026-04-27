import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { useStore } from "../lib/store";

function AnnouncementBar() {
  const { announcements } = useStore();
  const active = announcements.filter((a) => a.active);
  const [dismissed, setDismissed] = useState(
    () => JSON.parse(sessionStorage.getItem("insight_dismissed") || "[]")
  );
  const visible = active.filter((a) => !dismissed.includes(a.id));
  if (!visible.length) return null;
  const a = visible[0];

  const close = () => {
    const next = [...dismissed, a.id];
    setDismissed(next);
    sessionStorage.setItem("insight_dismissed", JSON.stringify(next));
  };

  const tone =
    a.level === "warning"
      ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
      : a.level === "success"
      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
      : "bg-[var(--color-amber)]/10 border-[var(--color-amber)]/30 text-[var(--color-amber)]";

  return (
    <div
      role="status"
      className={`fixed top-0 inset-x-0 z-[60] border-b backdrop-blur ${tone}`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-2.5 flex items-center gap-3">
        <Megaphone size={16} className="shrink-0" aria-hidden="true" />
        <div className="text-sm flex-1 min-w-0">
          <strong className="font-semibold mr-2">{a.title}</strong>
          <span className="opacity-90">{a.body}</span>
        </div>
        <button
          onClick={close}
          aria-label="Fechar aviso"
          className="shrink-0 p-1.5 rounded hover:bg-white/10 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
