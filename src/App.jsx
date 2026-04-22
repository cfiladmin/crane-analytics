import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection, addDoc, onSnapshot, deleteDoc, doc,
  setDoc, getDoc, getDocs, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  loadCurrentStore, saveCurrentStore,
  DEFAULT_SETTINGS,
} from './utils/analytics';
import PlayScreen    from './components/PlayScreen';
import Dashboard     from './components/Dashboard';
import HistoryScreen from './components/HistoryScreen';
import SettingsScreen from './components/SettingsScreen';
import LoginScreen   from './components/LoginScreen';
import LandingPage   from './components/LandingPage';
import { IconPlay, IconChart, IconHistory, IconSettings } from './components/Icons';

const TABS = [
  { id: 'play',     label: 'プレイ',  Icon: IconPlay     },
  { id: 'dash',     label: 'ダッシュ', Icon: IconChart    },
  { id: 'history',  label: '履歴',    Icon: IconHistory  },
  { id: 'settings', label: '設定',    Icon: IconSettings },
];

export default function App() {
  const [user,         setUser]         = useState(undefined); // undefined=確認中
  const [showLogin,    setShowLogin]    = useState(false);    // LP→ログイン遷移
  const [tab,          setTab]          = useState('play');
  const [sessions,     setSessions]     = useState([]);
  const [currentStore, setCurrentStore] = useState(() => loadCurrentStore());
  const [settings,     setSettings]     = useState({ ...DEFAULT_SETTINGS });

  // ── LP→ログイン 戻るボタン対応 ────────────────────
  useEffect(() => {
    if (showLogin) window.history.pushState({ crane: 'login' }, '');
  }, [showLogin]);
  useEffect(() => {
    const handler = () => { if (showLogin) setShowLogin(false); };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [showLogin]);

  // ── 認証状態の監視 ────────────────────────────────
  useEffect(() => {
    let prevUser = undefined; // undefined=初回未確認
    const unsub = onAuthStateChanged(auth, u => {
      // null→User への変化 = 新規ログイン
      if (prevUser === null && u) {
        const trackEvent = (name, params = {}) => {
          if (typeof window.gtag === 'function') window.gtag('event', name, params);
        };
        trackEvent('login', { method: 'Google' });
        // 作成時刻と最終ログイン時刻が一致 = 新規登録
        const created  = u.metadata?.creationTime;
        const lastSign = u.metadata?.lastSignInTime;
        if (created && lastSign && created === lastSign) {
          trackEvent('sign_up', { method: 'Google' });
        }
      }
      prevUser = u ?? null;
      setUser(u ?? null);
    });
    return unsub;
  }, []);

  // ── Firestore: セッション リアルタイム同期 ────────
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'sessions'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      setSessions(snap.docs.map(d => ({ firestoreId: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  // ── Firestore: 設定 読み込み ───────────────────────
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid, 'settings', 'config')).then(snap => {
      if (snap.exists()) setSettings({ ...DEFAULT_SETTINGS, ...snap.data() });
    });
  }, [user]);

  // ── ハンドラー ────────────────────────────────────
  const handleSessionEnd = useCallback(async (finished) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'sessions'), {
      ...finished,
      createdAt: serverTimestamp(),
    });
  }, [user]);

  const handleStoreChange = useCallback((name) => {
    setCurrentStore(name);
    saveCurrentStore(name);
  }, []);

  const handleClear = useCallback(async () => {
    if (!user) return;
    const snap = await getDocs(collection(db, 'users', user.uid, 'sessions'));
    await Promise.all(snap.docs.map(d =>
      deleteDoc(doc(db, 'users', user.uid, 'sessions', d.id))
    ));
  }, [user]);

  const handleDeleteSession = useCallback(async (firestoreId) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'sessions', firestoreId));
  }, [user]);

  const handleSettingsSave = useCallback(async (s) => {
    setSettings(s);
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid, 'settings', 'config'), s);
  }, [user]);

  const handleSignOut = useCallback(() => signOut(auth), []);

  // ── ローディング ──────────────────────────────────
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-arcade-bg">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── 未ログイン：ランディングページ or ログイン画面 ──
  if (user === null) {
    return (
      <div className="flex flex-col" style={{ height: '100dvh', maxWidth: 480, margin: '0 auto' }}>
        {showLogin
          ? <LoginScreen />
          : <LandingPage onStart={() => setShowLogin(true)} />
        }
      </div>
    );
  }

  // ── ログイン済み ──────────────────────────────────
  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', maxWidth: 480, margin: '0 auto', position: 'relative' }}
    >
      {/* ── グローバルヘッダー ── */}
      <header className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-arcade-border
                         flex items-center justify-between bg-arcade-bg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="#080810" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          </div>
          <span className="text-arcade-text text-base font-bold tracking-tight">
            クレーン<span style={{ color: '#f59e0b' }}>Ana</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-arcade-muted text-xs">{sessions.length}件記録済み</span>
          {/* アバター＋サインアウト */}
          <button onClick={handleSignOut}
            className="no-select flex items-center gap-1.5 cursor-pointer rounded-xl px-2 py-1
                       border border-arcade-border bg-arcade-cardAlt hover:bg-red-50 transition-colors">
            {user.photoURL
              ? <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" />
              : <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-white">
                  {user.displayName?.[0] ?? '?'}
                </div>
            }
            <span className="text-arcade-muted text-xs">ログアウト</span>
          </button>
        </div>
      </header>

      {/* ── コンテンツ ── */}
      <main className="flex-1 overflow-hidden bg-arcade-bg">
        {tab === 'play' && (
          <PlayScreen
            sessions={sessions}
            currentStore={currentStore}
            onSessionEnd={handleSessionEnd}
            onStoreChange={handleStoreChange}
            settings={settings}
          />
        )}
        {tab === 'dash' && <Dashboard sessions={sessions} />}
        {tab === 'history' && <HistoryScreen sessions={sessions} onClear={handleClear} onDeleteSession={handleDeleteSession} />}
        {tab === 'settings' && <SettingsScreen settings={settings} onSave={handleSettingsSave} />}
      </main>

      {/* ── ボトムナビ ── */}
      <nav className="flex-shrink-0 border-t border-arcade-border bg-arcade-card flex">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)}
              className="no-select flex-1 flex flex-col items-center justify-center
                         py-3 gap-1 cursor-pointer transition-colors duration-150"
              style={{ minHeight: 58, background: 'none', border: 'none' }}
              aria-label={label}>
              <Icon size={22} color={active ? '#f59e0b' : '#6b7280'} />
              <span className="text-xs font-medium" style={{ color: active ? '#f59e0b' : '#6b7280' }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
