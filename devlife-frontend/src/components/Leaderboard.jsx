import { useEffect, useState } from 'react'
import api from '../api'

export default function Leaderboard() {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    api.get('/api/casino/leaderboard').then(r => setRows(r.data)).catch(() => setRows([]))
  }, [])

  return (
    <div className="rounded-2xl bg-white/5 p-5 animate-fade-in">
      <h2 className="mb-3 text-lg font-bold">🏆 Leaderboard</h2>
      {rows === null ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-8 animate-pulse rounded bg-white/10" />)}
        </div>
      ) : (
        <ol className="space-y-2">
          {rows.map((r, i) => (
            <li key={r.username} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span>{['🥇', '🥈', '🥉'][i] ?? `${i + 1}.`} {r.username}</span>
              <span className="text-sm text-white/70">🪙 {r.points} · 🔥 {r.bestStreak}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}