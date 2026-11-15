import { useEffect, useState } from 'react';
import api from '../api';
import useUser from '../hooks/useUser';
import Navbar from '../components/Navbar';
import Leaderboard from '../components/Leaderboard';

function CodePanel({ label, code, state, onClick }) {
  const styles = {
    idle: 'border-slate-700 hover:border-primary cursor-pointer',
    selected: 'border-primary ring-2 ring-primary/40 cursor-pointer',
    correct: 'border-success bg-success/10',
    wrong: 'border-danger bg-danger/10',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`w-full rounded-xl border-2 bg-slate-800/60 p-4 text-left transition ${styles[state]}`}
    >
      <div className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span>კოდი {label}</span>
        {state === 'correct' && <span className="text-success">✅ სწორია</span>}
        {state === 'wrong' && <span className="text-danger">🐛 bug-ია</span>}
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-slate-200">{code}</pre>
    </div>
  );
}

export default function CasinoPage() {
  const { user, refresh } = useUser();
  const [round, setRound] = useState(null);
  const [choice, setChoice] = useState(null);
  const [amount, setAmount] = useState(10);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lbKey, setLbKey] = useState(0);

  const loadRound = async (daily = false) => {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.get(daily ? '/api/casino/daily' : '/api/casino/round');
      setRound(data);
      setResult(null);
      setChoice(null);
    } catch (e) {
      const msg = e.response?.data;
      setError(typeof msg === 'string' ? msg : 'რაუნდის ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadRound(false);
  }, []);

  const placeBet = async () => {
    if (!choice) {
      setError('ჯერ აირჩიე კოდი');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/api/casino/bet', {
        roundId: round.roundId,
        choice,
        amount: Number(amount),
      });
      setResult(data);
      refresh();
      setLbKey((k) => k + 1);
    } catch (e) {
      const msg = e.response?.data;
      setError(typeof msg === 'string' ? msg : 'ფსონის დადება ვერ მოხერხდა');
    } finally {
      setBusy(false);
    }
  };

  const panelState = (label) => {
    if (result) {
      if (label === result.correctChoice) return 'correct';
      if (label === choice) return 'wrong';
      return 'idle';
    }
    return choice === label ? 'selected' : 'idle';
  };

  const select = (label) => {
    if (!result) setChoice(label);
  };

  const potentialWin = round
    ? Math.round(Number(amount || 0) * 2 * round.luckMultiplier * (round.isDaily ? 1.5 : 1))
    : 0;

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-bold">🎰 კოდის კაზინო</h1>
            <p className="text-slate-400">რომელი კოდი მუშაობს სწორად? დადე points და გამოიცანი.</p>
          </div>
          <button
            onClick={() => loadRound(true)}
            disabled={busy}
            className="rounded-lg border border-primary/60 bg-primary/10 px-4 py-2 font-semibold transition hover:bg-primary/20 disabled:opacity-60"
          >
            📅 Daily Challenge
          </button>
        </div>

        {!round && !error && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-40 animate-pulse rounded-xl bg-slate-800" />
            <div className="h-40 animate-pulse rounded-xl bg-slate-800" />
          </div>
        )}

        {round && (
          <div className="animate-fade-in">
            <div className="mb-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-primary/20 px-3 py-1">{round.stack}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1">
                სირთულე: {'⭐'.repeat(round.difficulty)}
              </span>
              <span className="rounded-full bg-success/20 px-3 py-1">
                🍀 დღის იღბალი: x{round.luckMultiplier.toFixed(1)}
              </span>
              {round.isDaily && (
                <span className="rounded-full bg-primary px-3 py-1 font-semibold">📅 Daily ბონუსი x1.5</span>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <CodePanel label="A" code={round.snippetA} state={panelState('A')} onClick={() => select('A')} />
              <CodePanel label="B" code={round.snippetB} state={panelState('B')} onClick={() => select('B')} />
            </div>

            {!result && (
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-800/50 p-5">
                <label className="mb-2 block text-sm text-slate-400">ფსონი</label>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-primary"
                  />
                  {[10, 50, 100].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className="rounded-lg border border-slate-700 px-3 py-2 transition hover:border-primary"
                    >
                      {v}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => user && setAmount(user.points)}
                    className="rounded-lg border border-slate-700 px-3 py-2 transition hover:border-danger"
                  >
                    All-in 🎲
                  </button>
                </div>

                <p className="mb-4 text-sm text-slate-400">
                  სწორი პასუხის შემთხვევაში: <span className="text-success">≈ +{potentialWin}</span> · შეცდომისას:{' '}
                  <span className="text-danger">-{Number(amount || 0)}</span>
                </p>

                <button
                  onClick={placeBet}
                  disabled={busy}
                  className="w-full rounded-lg bg-primary py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? '⏳ ...' : '🎲 დადე ფსონი'}
                </button>
              </div>
            )}

            {result && (
              <div
                className={`mt-6 rounded-xl border p-5 ${
                  result.isWin
                    ? 'animate-pop border-success bg-success/10'
                    : 'animate-shake border-danger bg-danger/10'
                }`}
              >
                <h2 className="mb-2 text-2xl font-bold">
                  {result.isWin ? `🎉 მოიგე +${result.pointsChange}` : `💥 წააგე ${result.pointsChange}`}
                </h2>
                <p className="mb-2 text-slate-300">
                  ბალანსი: 🪙 {result.newBalance} · Streak: 🔥 {result.currentStreak}
                </p>
                {result.explanation && <p className="mb-4 text-slate-300">💡 {result.explanation}</p>}
                <button
                  onClick={() => loadRound(false)}
                  disabled={busy}
                  className="rounded-lg bg-primary px-5 py-2 font-semibold transition hover:brightness-110 disabled:opacity-60"
                >
                  შემდეგი რაუნდი ➡️
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="animate-shake mt-4 text-danger">
            ⚠️ {error}
            <button onClick={() => loadRound(false)} className="ml-3 underline">
              ახალი რაუნდი
            </button>
          </div>
        )}

        <div className="mt-10">
          <Leaderboard key={lbKey} />
        </div>
      </main>
    </div>
  );
}