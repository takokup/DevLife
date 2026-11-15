import { useEffect, useState } from 'react';
import api from '../api';
import useUser from '../hooks/useUser';
import Navbar from '../components/Navbar';

const categories = [
  { value: 'standup', label: '☕ Daily standup' },
  { value: 'sprint', label: '📋 Sprint planning' },
  { value: 'client', label: '🤝 Client meeting' },
  { value: 'team', label: '🎉 Team building' },
];

const types = [
  { value: 'technical', label: '🔧 Technical' },
  { value: 'personal', label: '🐱 Personal' },
  { value: 'creative', label: '🤖 Creative' },
];

function getScoreColor(score) {
  if (score >= 60) return 'bg-success';
  if (score >= 30) return 'bg-amber-400';
  return 'bg-danger';
}

function getScoreText(score) {
  if (score >= 60) return 'ძალიან დამაჯერებელია 😎';
  if (score >= 30) return 'ეგრე-ისე 🤔';
  return 'ვერავინ დაიჯერებს 😅';
}

export default function MeetingEscapePage() {
  const { user } = useUser();
  const [category, setCategory] = useState('standup');
  const [type, setType] = useState('technical');
  const [excuse, setExcuse] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const loadFavorites = async () => {
    try {
      const { data } = await api.get('/api/excuses/favorites');
      setFavorites(data);
    } catch {
      showMessage('ფავორიტების ჩატვირთვა ვერ მოხერხდა');
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/excuses/generate', {
        params: { category, type },
      });
      setExcuse(data);
    } catch {
      showMessage('საბაბის გენერაცია ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showMessage('📋 დაკოპირდა!');
    } catch {
      showMessage('კოპირება ვერ მოხერხდა');
    }
  };

  const shareExcuse = async () => {
    const text = `🏃‍♂️ ${excuse.text} (დამაჯერებლობა: ${excuse.believability}%) #DevLife`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        return;
      }
    } else {
      copyText(text);
    }
  };

  const saveFavorite = async () => {
    try {
      await api.post('/api/excuses/favorites', excuse);
      showMessage('⭐ შენახულია!');
      loadFavorites();
    } catch {
      showMessage('შენახვა ვერ მოხერხდა');
    }
  };

  const removeFavorite = async (id) => {
    try {
      await api.delete(`/api/excuses/favorites/${id}`);
      loadFavorites();
    } catch {
      showMessage('წაშლა ვერ მოხერხდა');
    }
  };

  const isSaved = excuse && favorites.some((f) => f.id === excuse.id);

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">🏃‍♂️ გაექეცი შეხვედრას</h1>
        <p className="mb-6 text-slate-400">აირჩიე შეხვედრა და საბაბის ტიპი, დანარჩენს ჩვენ მივხედავთ.</p>

        <h2 className="mb-2 text-sm text-slate-400">შეხვედრა</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-lg border-2 px-4 py-2 transition ${
                category === c.value ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-primary'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <h2 className="mb-2 text-sm text-slate-400">საბაბის ტიპი</h2>
        <div className="mb-6 flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`rounded-lg border-2 px-4 py-2 transition ${
                type === t.value ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? '⏳ ვფიქრობ...' : '🎲 მოიფიქრე საბაბი'}
        </button>

        {loading && !excuse && <div className="mt-6 h-40 animate-pulse rounded-xl bg-slate-800" />}

        {excuse && (
          <div key={excuse.id} className="animate-pop mt-6 rounded-xl border border-slate-700 bg-slate-800/60 p-5">
            <p className="mb-4 text-lg">{excuse.text}</p>

            <div className="mb-1 flex justify-between text-sm text-slate-400">
              <span>დამაჯერებლობა</span>
              <span>
                {excuse.believability}% · {getScoreText(excuse.believability)}
              </span>
            </div>
            <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-900">
              <div
                className={`h-full transition-all duration-500 ${getScoreColor(excuse.believability)}`}
                style={{ width: `${excuse.believability}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyText(excuse.text)}
                className="rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary"
              >
                📋 კოპირება
              </button>
              <button
                onClick={saveFavorite}
                disabled={isSaved}
                className="rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary disabled:opacity-60"
              >
                {isSaved ? '⭐ შენახულია' : '☆ შენახვა'}
              </button>
              <button
                onClick={shareExcuse}
                className="rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary"
              >
                📤 გაზიარება
              </button>
            </div>
          </div>
        )}

        <h2 className="mb-3 mt-10 text-lg font-bold">⭐ ფავორიტები</h2>
        {favorites.length === 0 && <p className="text-slate-400">ჯერ არაფერი გაქვს შენახული.</p>}
        <div className="space-y-3">
          {favorites.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
              <p className="mb-2">{f.text}</p>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>დამაჯერებლობა: {f.believability}%</span>
                <div className="flex gap-3">
                  <button onClick={() => copyText(f.text)} className="hover:text-white">
                    📋
                  </button>
                  <button onClick={() => removeFavorite(f.id)} className="hover:text-danger">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div className="animate-fade-in fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-slate-700 px-5 py-3 shadow-lg">
            {message}
          </div>
        )}
      </main>
    </div>
  );
}