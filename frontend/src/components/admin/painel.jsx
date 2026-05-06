import { useNavigate } from "react-router-dom";
import axios from "axios";

function Painel() {
  const navigate = useNavigate();
  const handleClick = async () => {
    axios.post('http://localhost:3000/api/auth/logout');
    navigate('/');
  };
  return (
    <div className="min-h-screen p-8 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Painel Insight</h1>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
          >
            Log Out
          </button>
        </div>
        <p className="text-[var(--color-text-muted)]">Working on it.</p>
      </div>
    </div>
  );
}

export default Painel;
