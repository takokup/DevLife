import { useEffect, useRef, useState } from 'react';
import api from '../api';
import useUser from '../hooks/useUser';
import Navbar from '../components/Navbar';

const genders = [
  { value: 'male', label: '👨 კაცი' },
  { value: 'female', label: '👩 ქალი' },
  { value: 'other', label: '🌈 სხვა' },
];

const lookingForOptions = [
  { value: 'male', label: '👨 კაცები' },
  { value: 'female', label: '👩 ქალები' },
  { value: 'any', label: '💞 ყველა' },
];

function getErrorText(e, fallback) {
  const msg = e.response?.data;
  return typeof msg === 'string' ? msg : fallback;
}

function SetupForm({ onSaved }) {
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (!gender || !lookingFor) {
      setError('აირჩიე სქესი და ვის ეძებ');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const { data } = await api.post('/api/dating/setup', { gender, lookingFor, bio });
      onSaved(data);
    } catch (err) {
      setError(getErrorText(err, 'შენახვა ვერ მოხერხდა'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-800/50 p-6">
      <h2 className="mb-4 text-xl font-bold">🧩 შეავსე დეითინგის პროფილი</h2>

      <p className="mb-2 text-sm text-slate-400">შენ ხარ</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {genders.map((g) => (
          <button
            key={g.value}
            type="button"
            onClick={() => setGender(g.value)}
            className={`rounded-lg border-2 px-4 py-2 transition ${
              gender === g.value ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-primary'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-sm text-slate-400">ვის ეძებ</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {lookingForOptions.map((g) => (
          <button
            key={g.value}
            type="button"
            onClick={() => setLookingFor(g.value)}
            className={`rounded-lg border-2 px-4 py-2 transition ${
              lookingFor === g.value ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-primary'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-sm text-slate-400">Bio ({bio.length}/200)</p>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={200}
        rows={3}
        placeholder="მაგ: ღამით ვწერ კოდს და დილით ვასწორებ..."
        className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-primary"
      />

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-primary py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
      >
        {saving ? '⏳ ...' : '💾 შენახვა და დაწყება'}
      </button>

      {error && <p className="animate-shake mt-3 text-danger">⚠️ {error}</p>}
    </form>
  );
}

function ChatPanel({ profile, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    api
      .get(`/api/dating/chat/${profile.id}`)
      .then((res) => setMessages(res.data))
      .catch(() => {});
  }, [profile.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message || sending) return;

    setMessages((prev) => [...prev, { from: 'me', text: message }]);
    setText('');
    setSending(true);
    setError('');

    try {
      const { data } = await api.post('/api/dating/chat', { profileId: profile.id, message });
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      setError(getErrorText(err, 'შეტყობინება ვერ გაიგზავნა'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-800/50">
      <div className="flex items-center gap-3 border-b border-slate-800 p-4">
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          ⬅️
        </button>
        <span className="text-3xl">{profile.emoji}</span>
        <div>
          <div className="font-bold">
            {profile.name}, {profile.age}
          </div>
          <div className="text-xs text-slate-400">
            {profile.techStack} · 💞 {profile.compatibility}%
          </div>
        </div>
      </div>

      <div className="h-80 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400">დაწერე პირველი შეტყობინება 👋 ({profile.bio})</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              m.from === 'me' ? 'ml-auto bg-primary' : 'bg-slate-700'
            }`}
          >
            {m.text}
          </div>
        ))}
        {sending && <div className="w-fit animate-pulse rounded-2xl bg-slate-700 px-4 py-2">✍️ {profile.name} წერს...</div>}
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-4 pb-2 text-sm text-danger">⚠️ {error}</p>}

      <form onSubmit={send} className="flex gap-2 border-t border-slate-800 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
          placeholder="დაწერე შეტყობინება..."
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-primary px-5 py-2 font-semibold transition hover:brightness-110 disabled:opacity-60"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

export default function DatingPage() {
  const { user } = useUser();
  const [setup, setSetup] = useState(undefined);
  const [tab, setTab] = useState('swipe');
  const [card, setCard] = useState(null);
  const [noMore, setNoMore] = useState(false);
  const [animating, setAnimating] = useState(null);
  const [matches, setMatches] = useState([]);
  const [pending, setPending] = useState(0);
  const [activeChat, setActiveChat] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const previousCount = useRef(null);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  const loadNext = async () => {
    setCard(null);
    setNoMore(false);
    try {
      const { data } = await api.get('/api/dating/next');
      setCard(data);
    } catch (e) {
      if (e.response?.status === 404) setNoMore(true);
      else setError(getErrorText(e, 'პროფილის ჩატვირთვა ვერ მოხერხდა'));
    }
  };

  useEffect(() => {
    api
      .get('/api/dating/setup')
      .then((res) => setSetup(res.data))
      .catch((e) => {
        if (e.response?.status === 404) setSetup(null);
        else setError('ჩატვირთვა ვერ მოხერხდა');
      });
  }, []);

  useEffect(() => {
    if (!setup) return;

    loadNext();

    const loadMatches = async () => {
      try {
        const { data } = await api.get('/api/dating/matches');
        if (previousCount.current !== null && data.matches.length > previousCount.current) {
          showMessage('💘 ახალი match!');
        }
        previousCount.current = data.matches.length;
        setMatches(data.matches);
        setPending(data.pending);
      } catch {
        return;
      }
    };

    loadMatches();
    const intervalId = setInterval(loadMatches, 5000);

    return () => clearInterval(intervalId);
  }, [setup]);

  const swipe = async (like) => {
    if (!card || animating) return;

    setAnimating(like ? 'right' : 'left');
    setError('');

    try {
      await api.post('/api/dating/swipe', { profileId: card.id, like });
      if (like) showMessage('💚 Like გაიგზავნა! match მალე გამოჩნდება...');
    } catch (e) {
      setError(getErrorText(e, 'ვერ გაიგზავნა'));
    }

    setTimeout(() => {
      setAnimating(null);
      loadNext();
    }, 350);
  };

  const cardClass = () => {
    if (animating === 'right') return 'translate-x-40 rotate-12 opacity-0';
    if (animating === 'left') return '-translate-x-40 -rotate-12 opacity-0';
    return '';
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">💑 Dev Dating Room</h1>
        <p className="mb-6 text-slate-400">იპოვე დეველოპერი, რომელსაც შენი bug-ები არ შეაშინებს.</p>

        {setup === undefined && !error && <div className="h-64 animate-pulse rounded-2xl bg-slate-800" />}

        {setup === null && <SetupForm onSaved={(data) => setSetup(data)} />}

        {setup && (
          <>
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setTab('swipe')}
                className={`flex-1 rounded-lg border-2 py-2 transition ${
                  tab === 'swipe' ? 'border-primary bg-primary/20' : 'border-slate-700'
                }`}
              >
                💘 Swipe
              </button>
              <button
                onClick={() => {
                  setTab('matches');
                  setActiveChat(null);
                }}
                className={`flex-1 rounded-lg border-2 py-2 transition ${
                  tab === 'matches' ? 'border-primary bg-primary/20' : 'border-slate-700'
                }`}
              >
                💬 Matches ({matches.length})
                {pending > 0 && <span className="ml-1 text-xs text-slate-400">⏳{pending}</span>}
              </button>
            </div>

            {tab === 'swipe' && (
              <div>
                {!card && !noMore && <div className="h-80 animate-pulse rounded-2xl bg-slate-800" />}

                {noMore && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-8 text-center">
                    <div className="mb-2 text-4xl">😢</div>
                    <p className="font-semibold">პროფილები გათავდა</p>
                    <p className="text-sm text-slate-400">შეამოწმე Matches ჩანართი, ვინმე შეიძლება უკვე გელოდება.</p>
                  </div>
                )}

                {card && (
                  <div>
                    <div
                      className={`rounded-2xl border border-primary/40 bg-linear-to-br from-primary/20 to-slate-900 p-6 text-center transition-all duration-300 ${cardClass()}`}
                    >
                      <div className="mb-2 text-7xl">{card.emoji}</div>
                      <h2 className="text-2xl font-bold">
                        {card.name}, {card.age}
                      </h2>
                      <span className="my-2 inline-block rounded-full bg-primary/30 px-3 py-1 text-sm">
                        {card.techStack}
                      </span>
                      <p className="mb-4 text-slate-300">{card.bio}</p>

                      <div className="mb-1 flex justify-between text-sm text-slate-400">
                        <span>💞 თავსებადობა</span>
                        <span>{card.compatibility}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-900">
                        <div
                          className="h-full bg-success transition-all duration-500"
                          style={{ width: `${card.compatibility}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center gap-8">
                      <button
                        onClick={() => swipe(false)}
                        disabled={animating !== null}
                        className="h-16 w-16 rounded-full border-2 border-danger text-3xl transition hover:scale-110 hover:bg-danger/20 disabled:opacity-60"
                      >
                        ❌
                      </button>
                      <button
                        onClick={() => swipe(true)}
                        disabled={animating !== null}
                        className="h-16 w-16 rounded-full border-2 border-success text-3xl transition hover:scale-110 hover:bg-success/20 disabled:opacity-60"
                      >
                        💚
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'matches' && !activeChat && (
              <div className="space-y-3">
                {pending > 0 && (
                  <p className="animate-pulse text-sm text-slate-400">⏳ {pending} match მოლოდინშია, მალე გამოჩნდება...</p>
                )}
                {matches.length === 0 && pending === 0 && (
                  <p className="text-slate-400">ჯერ match არ გაქვს. დალაიქე ვინმე! 💚</p>
                )}
                {matches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveChat(m)}
                    className="animate-fade-in flex w-full items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-left transition hover:border-primary"
                  >
                    <span className="text-4xl">{m.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {m.name}, {m.age}
                      </div>
                      <div className="text-sm text-slate-400">
                        {m.techStack} · 💞 {m.compatibility}%
                      </div>
                    </div>
                    <span>💬</span>
                  </button>
                ))}
              </div>
            )}

            {tab === 'matches' && activeChat && <ChatPanel profile={activeChat} onBack={() => setActiveChat(null)} />}
          </>
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