import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import api from '../api';
import useUser from '../hooks/useUser';
import Navbar from '../components/Navbar';

export default function AnalyzerPage() {
  const { user } = useUser();
  const cardRef = useRef(null);
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const getErrorText = (e, fallback) => {
    const msg = e.response?.data;
    return typeof msg === 'string' ? msg : fallback;
  };

  const loadRepos = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoadingRepos(true);
    setError('');
    setRepos(null);
    setSelected(null);
    setResult(null);

    try {
      const { data } = await api.get('/api/github/repos', { params: { username: username.trim() } });
      setRepos(data);
      if (data.length === 0) setError('საჯარო რეპოზიტორიები ვერ მოიძებნა');
    } catch (err) {
      setError(getErrorText(err, 'რეპოზიტორიების ჩატვირთვა ვერ მოხერხდა'));
    } finally {
      setLoadingRepos(false);
    }
  };

  const analyze = async () => {
    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const { data } = await api.post('/api/github/analyze', { owner: selected.owner, repo: selected.name });
      setResult(data);
    } catch (err) {
      setError(getErrorText(err, 'ანალიზი ვერ მოხერხდა'));
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadCard = async () => {
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#0f172a' });
      const link = document.createElement('a');
      link.download = `devlife-${result.repo}.png`;
      link.href = url;
      link.click();
    } catch {
      showMessage('სურათის შექმნა ვერ მოხერხდა');
    }
  };

  const copyText = async () => {
    const text = `${result.emoji} ${result.personality} (${result.owner}/${result.repo})\n${result.description}\n#DevLife`;
    try {
      await navigator.clipboard.writeText(text);
      showMessage('📋 დაკოპირდა!');
    } catch {
      showMessage('კოპირება ვერ მოხერხდა');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">🔍 მაჩვენე შენი კოდი და გეტყვი ვინ ხარ</h1>
        <p className="mb-6 text-slate-400">შეიყვანე GitHub username, აირჩიე რეპოზიტორია და AI პიროვნებას დაგიდგენს.</p>

        <form onSubmit={loadRepos} className="mb-6 flex gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub username"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loadingRepos}
            className="rounded-lg bg-primary px-6 py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
          >
            {loadingRepos ? '⏳' : '🔎 ძებნა'}
          </button>
        </form>

        {loadingRepos && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-800" />
            ))}
          </div>
        )}

        {repos && repos.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="mb-3 text-sm text-slate-400">აირჩიე რეპოზიტორია</h2>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              {repos.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSelected(r)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    selected?.name === r.name ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-primary'
                  }`}
                >
                  <div className="font-semibold">📁 {r.name}</div>
                  <div className="mb-1 line-clamp-1 text-sm text-slate-400">{r.description || 'აღწერა არ არის'}</div>
                  <div className="text-xs text-slate-500">
                    {r.language || '—'} · ⭐ {r.stars}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={analyze}
              disabled={!selected || analyzing}
              className="w-full rounded-lg bg-primary py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
            >
              {analyzing ? '🧠 ვაანალიზებ...' : '🧠 დამიდგინე პიროვნება'}
            </button>
          </div>
        )}

        {analyzing && <div className="mt-6 h-64 animate-pulse rounded-2xl bg-slate-800" />}

        {result && !analyzing && (
          <div className="mt-6 animate-pop">
            <div
              ref={cardRef}
              className="rounded-2xl border border-primary/40 bg-linear-to-br from-primary/30 to-slate-900 p-6"
            >
              <div className="mb-1 text-5xl">{result.emoji}</div>
              <h2 className="text-2xl font-bold">{result.personality}</h2>
              <p className="mb-4 text-sm text-slate-400">
                {result.owner}/{result.repo}
              </p>
              <p className="mb-4 text-slate-200">{result.description}</p>

              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-1 font-semibold text-success">💪 ძლიერი მხარეები</h3>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {result.strengths.map((s) => (
                      <li key={s}>✅ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-danger">😅 სუსტი მხარეები</h3>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {result.weaknesses.map((w) => (
                      <li key={w}>⚠️ {w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-1 font-semibold">🌟 შენნაირი ცნობილი დეველოპერები</h3>
                <ul className="space-y-1 text-sm text-slate-300">
                  {result.celebrities.map((c) => (
                    <li key={c}>👤 {c}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-800 px-3 py-1">{result.metrics.topLanguage}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">🔤 {result.metrics.namingStyle}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">💬 კომენტარები {result.metrics.commentPercent}%</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">
                  📝 კომიტები ~{result.metrics.avgCommitLength} სიმბ.
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1">
                  {result.metrics.hasReadme ? '📖 README ✓' : '📖 README ✗'}
                </span>
              </div>

              <p className="text-right text-xs text-slate-500">🚀 DevLife Portal</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={downloadCard}
                className="rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary"
              >
                📥 PNG ბარათი
              </button>
              <button
                onClick={copyText}
                className="rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary"
              >
                📋 ტექსტის კოპირება
              </button>
            </div>
          </div>
        )}

        {error && <div className="animate-shake mt-4 text-danger">⚠️ {error}</div>}

        {message && (
          <div className="animate-fade-in fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-slate-700 px-5 py-3 shadow-lg">
            {message}
          </div>
        )}
      </main>
    </div>
  );
}