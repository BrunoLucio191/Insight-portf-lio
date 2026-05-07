import { useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

function Admin({ setUser }) {
  const [form, setForm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/admin", { password: form });
      setUser(res.data);
      navigate("/painel");
    } catch {
      setUser(null);
      setError("Senha inválida");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-5 bg-[var(--color-bg)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)]"
      >
        {/* Ícone de Cadeado estilizado */}
        <div className="w-12 h-12 rounded-lg bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/30 flex items-center justify-center mb-5">
          <Lock size={20} className="text-[var(--color-amber)]" />
        </div>
        <h1 className="font-display font-bold text-2xl mb-3">Área restrita</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">
          Painel administrativo Insight
        </p>
        {error && <p className="text-red-500">Senha incorreta</p>}
        <input
          type="password"
          placeholder="Senha"
          value={form}
          onChange={(e) => setForm( e.target.value )}
          className="w-full min-h-[48px] px-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-amber)] mb-3"
        />

        <button
          className="w-full min-h-[48px] rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)] transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Admin;
