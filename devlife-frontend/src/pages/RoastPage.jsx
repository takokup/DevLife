import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import api from '../api';
import useUser from '../hooks/useUser';
import Navbar from '../components/Navbar';

const editorLanguages = {
  'C#': 'csharp',
  JavaScript: 'javascript',
  Python: 'python',
};

export default function RoastPage() {
  const { user, refresh } = useUser();
  const [difficulty, setDifficulty] = useState(1);
  const [task, setTask] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true);
      setError('');
      setResult(null);
      try {
        const { data } = await api.get('/api/roast/task', { params: { difficulty } });
        setTask(data);
        setCode(data.starterCode);
      } catch {
        setError('დავალების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [difficulty]);

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/api/roast/submit', { taskId: task.id, code });
      setResult(data);
      refresh();
    } catch (e) {
      const msg = e.response?.data;
      setError(typeof msg === 'string' ? msg : 'გაგზავნა ვერ მოხერხდა');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">🔥 კოდის როუსტი</h1>
        <p className="mb-6 text-slate-400">ამოხსენი დავალება და AI გეტყვის, რას ფიქრობს შენს კოდზე.</p>

        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-lg border-2 px-4 py-2 transition ${
                difficulty === d ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-primary'
              }`}
            >
              {'⭐'.repeat(d)}
            </button>
          ))}
        </div>

        {loading && <div className="h-64 animate-pulse rounded-xl bg-slate-800" />}

        {!loading && task && (
          <div className="animate-fade-in">
            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-800/50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-lg font-bold">{task.title}</h2>
                <span className="rounded-full bg-primary/20 px-3 py-1 text-sm">{task.language}</span>
              </div>
              <p className="text-slate-300">{task.description}</p>
            </div>

            <div className="mb-4 overflow-hidden rounded-xl border border-slate-700">
              <Editor
                height="300px"
                theme="vs-dark"
                language={editorLanguages[task.language]}
                value={code}
                onChange={(value) => setCode(value ?? '')}
                options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
              />
            </div>

            <button
              onClick={submit}
              disabled={submitting}
              className="w-full rounded-lg bg-primary py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? '🔥 AI ამზადებს როუსტს...' : '🔥 გაგზავნა და როუსტი'}
            </button>
          </div>
        )}

        {submitting && <div className="mt-6 h-32 animate-pulse rounded-xl bg-slate-800" />}

        {result && !submitting && (
          <div
            className={`mt-6 rounded-xl border p-5 ${
              result.isCorrect ? 'animate-pop border-success bg-success/10' : 'animate-shake border-danger bg-danger/10'
            }`}
          >
            <h2 className="mb-2 text-2xl font-bold">
              {result.isCorrect ? '✅ სწორია!' : '❌ არ მუშაობს'} · {result.score}/100
            </h2>
            <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-900">
              <div
                className={`h-full transition-all duration-500 ${result.isCorrect ? 'bg-success' : 'bg-danger'}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <p className="mb-3 text-lg">🔥 {result.roast}</p>
            <p className="text-slate-300">💡 {result.tip}</p>
            {result.pointsEarned > 0 && (
              <p className="mt-3 font-semibold text-success">🪙 +{result.pointsEarned} points (ბალანსი: {result.newBalance})</p>
            )}
          </div>
        )}

        {error && <div className="animate-shake mt-4 text-danger">⚠️ {error}</div>}
      </main>
    </div>
  );
}