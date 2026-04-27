import { useState } from "react";
import { Lock, LogOut } from "lucide-react";

function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("insight_admin") === "1"
  );
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // TODO: replace with real backend auth before production deploy.
    const expected = import.meta.env.VITE_ADMIN_PASS || "insight2017";
    if (pwd === expected) {
      sessionStorage.setItem("insight_admin", "1");
      setAuthed(true);
      setErr("");
    } else {
      setErr("Senha incorreta.");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center px-5 bg-[var(--color-bg)]">
        <form
          onSubmit={submit}
          className="w-full max-w-sm p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)]"
        >
          <div className="w-12 h-12 rounded-lg bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/30 flex items-center justify-center mb-5">
            <Lock size={20} className="text-[var(--color-amber)]" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-1">Área restrita</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Painel administrativo Insight
          </p>
          <input
            type="password"
            placeholder="Senha"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-amber)] mb-3"
          />
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)] transition-colors"
          >
            Entrar
          </button>
          {err && (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {err}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Painel Insight</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("insight_admin");
              setAuthed(false);
            }}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
        <p className="text-[var(--color-text-muted)]">Working on it.</p>
      </div>
    </div>
  );
}

export default Admin;
