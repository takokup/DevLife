import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      navigate('/');
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-800 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-bold">
          👨‍💻 DevLife
        </Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span title="Points">🪙 {user.points}</span>
            <span title="Streak">🔥 {user.currentStreak}</span>
            <span className="hidden text-slate-400 sm:inline">{user.username}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-700 px-3 py-1 transition hover:border-danger hover:text-danger"
            >
              გასვლა
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}