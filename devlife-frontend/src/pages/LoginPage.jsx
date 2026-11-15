import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const stacks = ['React', 'Angular', 'Vue', '.NET', 'Python', 'Node', 'Java'];
const levels = ['Junior', 'Middle', 'Senior'];

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-primary';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    techStack: 'React',
    level: 'Junior',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !form.birthDate) {
      setError('აირჩიე დაბადების თარიღი');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await api.post('/api/auth/register', form);
      }
      await api.post('/api/auth/login', { username: form.username, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === 'string' && msg) {
        setError(msg);
      } else {
        setError('რაღაც შეცდომა მოხდა, სცადე თავიდან');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="animate-fade-in w-full max-w-md rounded-2xl border border-slate-800 bg-slate-800/50 p-6">
        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl">🚀</div>
          <h1 className="text-2xl font-bold">DevLife Portal</h1>
          <p className="text-slate-400">დეველოპერის ცხოვრების სიმულატორი</p>
        </div>

        <div className="mb-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 rounded-lg border-2 py-2 transition ${
              mode === 'login' ? 'border-primary bg-primary/20' : 'border-slate-700'
            }`}
          >
            🔑 შესვლა
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 rounded-lg border-2 py-2 transition ${
              mode === 'register' ? 'border-primary bg-primary/20' : 'border-slate-700'
            }`}
          >
            ✨ რეგისტრაცია
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            value={form.username}
            onChange={update('username')}
            placeholder="Username"
            required
            className={inputClass}
          />

          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="პაროლი"
            required
            minLength={mode === 'register' ? 6 : undefined}
            className={inputClass}
          />

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.firstName}
                  onChange={update('firstName')}
                  placeholder="სახელი"
                  required
                  className={inputClass}
                />
                <input
                  value={form.lastName}
                  onChange={update('lastName')}
                  placeholder="გვარი"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-400">დაბადების თარიღი</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={update('birthDate')}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Stack</label>
                  <select value={form.techStack} onChange={update('techStack')} className={inputClass}>
                    {stacks.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">დონე</label>
                  <select value={form.level} onChange={update('level')} className={inputClass}>
                    {levels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? '⏳ ...' : mode === 'login' ? '🔑 შესვლა' : '✨ რეგისტრაცია'}
          </button>
        </form>

        {error && <p className="animate-shake mt-4 text-center text-danger">⚠️ {error}</p>}
      </div>
    </div>
  );
}