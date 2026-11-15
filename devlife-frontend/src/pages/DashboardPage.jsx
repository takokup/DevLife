import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import useUser from '../hooks/useUser';
import Navbar from '../components/Navbar';
import Leaderboard from '../components/Leaderboard';

const GAMES = [
  { emoji: '🎰', title: 'კოდის კაზინო', to: '/casino' },
  { emoji: '🔥', title: 'კოდის როუსტი', to: '/roast' },
  { emoji: '🏃', title: 'Bug Chase', to: '/bugchase' },
  { emoji: '🔍', title: 'მაჩვენე შენი კოდი', to: '/analyzer' },
  {emoji: '💑', title: 'Dev Dating Room', to: '/dating' },
  { emoji: '🏃‍♂️', title: 'გაექეცი შეხვედრას', to: '/meeting-escape' },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get('/api/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {data ? (
          <section className="animate-fade-in rounded-2xl border border-primary/30 bg-linear-to-br from-primary/20 to-slate-800/40 p-6">
            <p className="text-xl font-semibold sm:text-2xl">{data.greeting}</p>
          </section>
        ) : (
          <div className="h-24 animate-pulse rounded-2xl bg-slate-800" />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {data ? (
            <>
              <div className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-800/50 p-5">
                <h2 className="mb-2 font-semibold text-slate-300">🔮 დღის ჰოროსკოპი</h2>
                <p>{data.horoscope}</p>
              </div>
              <div className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-800/50 p-5">
                <h2 className="mb-2 font-semibold text-slate-300">🍀 დღის იღბლიანი ტექნოლოგია</h2>
                <p className="text-2xl font-bold text-success">{data.luckyTechnology}</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-28 animate-pulse rounded-2xl bg-slate-800" />
              <div className="h-28 animate-pulse rounded-2xl bg-slate-800" />
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {GAMES.map((g) =>
            g.to ? (
              <Link
                key={g.title}
                to={g.to}
                className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 text-center transition hover:-translate-y-1 hover:border-primary"
              >
                <div className="mb-2 text-4xl">{g.emoji}</div>
                <div className="font-semibold">{g.title}</div>
              </Link>
            ) : (
              <div
                key={g.title}
                className="rounded-2xl border border-slate-800 bg-slate-800/30 p-5 text-center opacity-50"
              >
                <div className="mb-2 text-4xl">{g.emoji}</div>
                <div className="font-semibold">{g.title}</div>
                <div className="mt-1 text-xs text-slate-400">მალე...</div>
              </div>
            ),
          )}
        </div>

        <Leaderboard />
      </main>
    </div>
  );
}