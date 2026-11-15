import { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import api from '../api';
import useUser from '../hooks/useUser';
import Navbar from '../components/Navbar';

const WIDTH = 800;
const HEIGHT = 300;
const GROUND = 250;
const PLAYER_X = 80;

const SKINS = ['🧑‍💻', '👩‍💻', '🦸', '🥷', '🤖', '🐱'];

const OBSTACLES = [
  { emoji: '🐛', width: 36, height: 36, lift: 0 },
  { emoji: '📅', width: 44, height: 44, lift: 0 },
  { emoji: '⏰', width: 36, height: 36, lift: 28 },
];

const ITEMS = [
  { emoji: '☕', type: 'coffee' },
  { emoji: '🏖️', type: 'weekend' },
];

function loadSkin() {
  try {
    return localStorage.getItem('bugchase-skin') || SKINS[0];
  } catch {
    return SKINS[0];
  }
}

function createGame() {
  return {
    running: false,
    lift: 0,
    velocity: 0,
    ducking: false,
    obstacles: [],
    items: [],
    score: 0,
    nextSpawn: 400,
    coffee: 0,
    weekend: 0,
  };
}

function jumpGame(game) {
  if (game.running && game.lift === 0 && game.velocity === 0) {
    game.velocity = 13;
  }
}

function hits(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function getPlayerBox(game) {
  const height = game.ducking && game.lift === 0 ? 20 : 40;
  const bottom = GROUND - game.lift;
  return { left: PLAYER_X + 6, right: PLAYER_X + 34, top: bottom - height, bottom };
}

function update(game, dt) {
  const baseSpeed = Math.min(6 + game.score / 150, 13);
  const speed = game.coffee > 0 ? baseSpeed * 1.3 : baseSpeed;

  if (game.lift > 0 || game.velocity > 0) {
    game.lift += game.velocity * dt;
    game.velocity -= 0.75 * dt;
    if (game.lift <= 0) {
      game.lift = 0;
      game.velocity = 0;
    }
  }

  game.score += 0.2 * dt * (game.coffee > 0 ? 2 : 1);
  game.coffee = Math.max(0, game.coffee - dt);
  game.weekend = Math.max(0, game.weekend - dt);

  game.nextSpawn -= speed * dt;
  if (game.nextSpawn <= 0) {
    if (Math.random() < 0.15) {
      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      game.items.push({ ...item, x: WIDTH, lift: 20 + Math.random() * 40 });
    } else {
      const obstacle = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
      game.obstacles.push({ ...obstacle, x: WIDTH });
    }
    game.nextSpawn = speed * (40 + Math.random() * 35);
  }

  game.obstacles.forEach((o) => {
    o.x -= speed * dt;
  });
  game.items.forEach((i) => {
    i.x -= speed * dt;
  });
  game.obstacles = game.obstacles.filter((o) => o.x > -60);
  game.items = game.items.filter((i) => i.x > -60);

  const player = getPlayerBox(game);

  game.items = game.items.filter((i) => {
    const box = { left: i.x, right: i.x + 30, top: GROUND - i.lift - 30, bottom: GROUND - i.lift };
    if (hits(player, box)) {
      if (i.type === 'coffee') game.coffee = 300;
      if (i.type === 'weekend') game.weekend = 300;
      return false;
    }
    return true;
  });

  if (game.weekend > 0) return false;

  return game.obstacles.some((o) => {
    const box = {
      left: o.x + 4,
      right: o.x + o.width - 4,
      top: GROUND - o.lift - o.height + 4,
      bottom: GROUND - o.lift - 4,
    };
    return hits(player, box);
  });
}

function draw(ctx, game, skin) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND + 2);
  ctx.lineTo(WIDTH, GROUND + 2);
  ctx.stroke();

  ctx.textBaseline = 'bottom';

  game.obstacles.forEach((o) => {
    ctx.font = `${o.height}px serif`;
    ctx.fillText(o.emoji, o.x, GROUND - o.lift);
  });

  game.items.forEach((i) => {
    ctx.font = '30px serif';
    ctx.fillText(i.emoji, i.x, GROUND - i.lift);
  });

  const ducking = game.ducking && game.lift === 0;
  ctx.font = ducking ? '26px serif' : '40px serif';
  ctx.globalAlpha = game.weekend > 0 && Math.floor(game.weekend / 6) % 2 === 0 ? 0.4 : 1;
  ctx.fillText(skin, PLAYER_X, GROUND - game.lift);
  ctx.globalAlpha = 1;

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`🏆 ${Math.floor(game.score)}`, 16, 12);

  if (game.coffee > 0) {
    ctx.fillStyle = '#10b981';
    ctx.fillText('☕ ქულა x2', 16, 42);
  }
  if (game.weekend > 0) {
    ctx.fillStyle = '#6366f1';
    ctx.fillText('🏖️ უკვდავი', 16, 70);
  }
}

export default function BugChasePage() {
  const { user, refresh } = useUser();
  const canvasRef = useRef(null);
  const gameRef = useRef(createGame());
  const [status, setStatus] = useState('idle');
  const [skin, setSkin] = useState(loadSkin);
  const [finalScore, setFinalScore] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    api
      .get('/api/bugchase/leaderboard')
      .then((res) => setLeaderboard(res.data))
      .catch(() => setLeaderboard([]));

    const connection = new HubConnectionBuilder().withUrl('/hubs/game').withAutomaticReconnect().build();

    connection.on('LeaderboardUpdated', (data) => {
      setLeaderboard(data);
    });

    connection.start().catch(() => {});

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jumpGame(gameRef.current);
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        gameRef.current.ducking = true;
      }
    };

    const onKeyUp = (e) => {
      if (e.code === 'ArrowDown') {
        gameRef.current.ducking = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const saveScore = async (score) => {
    try {
      const { data } = await api.post('/api/bugchase/score', { score });
      setResult(data);
      refresh();
    } catch {
      setError('ქულის შენახვა ვერ მოხერხდა');
    }
  };

  useEffect(() => {
    if (status !== 'running') return;

    const ctx = canvasRef.current.getContext('2d');
    let frameId = 0;
    let last = performance.now();

    const loop = (now) => {
      const game = gameRef.current;
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      const dead = update(game, dt);
      draw(ctx, game, skin);

      if (dead) {
        game.running = false;
        const score = Math.floor(game.score);
        setFinalScore(score);
        setStatus('over');
        saveScore(score);
        return;
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [status, skin]);

  const startGame = () => {
    const game = createGame();
    game.running = true;
    gameRef.current = game;
    setResult(null);
    setError('');
    setStatus('running');
  };

  const chooseSkin = (value) => {
    setSkin(value);
    try {
      localStorage.setItem('bugchase-skin', value);
    } catch {
      return;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">🏃 Bug Chase</h1>
        <p className="mb-4 text-slate-400">გაიქეცი Bug-ებისგან, Deadline-ებისგან და შეხვედრებისგან!</p>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-400">პერსონაჟი:</span>
          {SKINS.map((s) => (
            <button
              key={s}
              disabled={status === 'running'}
              onClick={() => chooseSkin(s)}
              className={`rounded-lg border-2 px-3 py-1 text-2xl transition ${
                skin === s ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
          <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="block w-full" />

          {status !== 'running' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/85 p-4 text-center">
              {status === 'idle' && (
                <>
                  <p className="mb-2 text-xl font-bold">მზად ხარ?</p>
                  <p className="mb-1 text-slate-300">⬆️ / Space: ხტომა · ⬇️: დახრა</p>
                  <p className="mb-4 text-sm text-slate-400">🐛 და 📅 გადახტი, ⏰ ქვემოდან გაიარე. ☕ ქულა x2, 🏖️ უკვდავება</p>
                </>
              )}

              {status === 'over' && (
                <>
                  <p className="mb-1 text-2xl font-bold text-danger">💀 დაგიჭირეს!</p>
                  <p className="mb-2 text-lg">ქულა: {finalScore}</p>
                  {!result && !error && <p className="mb-2 text-slate-400">⏳ ვინახავ...</p>}
                  {result && (
                    <div className="mb-3 text-sm text-slate-300">
                      <p>🏆 საუკეთესო: {result.bestScore} · 🪙 +{result.pointsEarned} (ბალანსი: {result.newBalance})</p>
                      {result.achievements.map((a) => (
                        <p key={a} className="animate-pop font-semibold text-success">
                          🎖️ ახალი მიღწევა: {a}
                        </p>
                      ))}
                    </div>
                  )}
                  {error && <p className="mb-2 text-danger">⚠️ {error}</p>}
                </>
              )}

              <button
                onClick={startGame}
                className="rounded-lg bg-primary px-8 py-3 font-semibold transition hover:brightness-110"
              >
                {status === 'over' ? '🔄 თავიდან' : '▶️ დაიწყე'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3 sm:hidden">
          <button
            onPointerDown={() => jumpGame(gameRef.current)}
            className="flex-1 rounded-lg border border-slate-700 py-4 text-lg"
          >
            ⬆️ ხტომა
          </button>
          <button
            onPointerDown={() => (gameRef.current.ducking = true)}
            onPointerUp={() => (gameRef.current.ducking = false)}
            onPointerLeave={() => (gameRef.current.ducking = false)}
            className="flex-1 rounded-lg border border-slate-700 py-4 text-lg"
          >
            ⬇️ დახრა
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 p-5">
          <h2 className="mb-3 text-lg font-bold">
            🏆 Leaderboard <span className="ml-2 text-xs text-danger">🔴 LIVE</span>
          </h2>
          {leaderboard === null && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-white/10" />
              ))}
            </div>
          )}
          {leaderboard && leaderboard.length === 0 && <p className="text-slate-400">ჯერ არავის უთამაშია.</p>}
          {leaderboard && leaderboard.length > 0 && (
            <ol className="space-y-2">
              {leaderboard.map((r, i) => (
                <li key={r.username} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span>
                    {['🥇', '🥈', '🥉'][i] ?? `${i + 1}.`} {r.username}
                  </span>
                  <span className="text-sm text-slate-300">🏃 {r.bestScore}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}