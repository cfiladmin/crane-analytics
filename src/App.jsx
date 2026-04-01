import { useState, useCallback } from 'react';
import {
  loadSessions, saveSessions,
  loadCurrentStore, saveCurrentStore, loadStoreList,
  loadSettings,
} from './utils/analytics';
import PlayScreen    from './components/PlayScreen';
import Dashboard     from './components/Dashboard';
import HistoryScreen from './components/HistoryScreen';
import SettingsScreen from './components/SettingsScreen';
import { IconPlay, IconChart, IconHistory, IconSettings } from './components/Icons';

const TABS = [
  { id: 'play',     label: 'プレイ',  Icon: IconPlay     },
  { id: 'dash',     label: 'ダッシュ', Icon: IconChart    },
  { id: 'history',  label: '履歴',    Icon: IconHistory  },
  { id: 'settings', label: '設定',    Icon: IconSettings },
];

export default function App() {
  const [tab,          setTab]          = useState('play');
  const [sessions,     setSessions]     = useState(() => loadSessions());
  const [currentStore, setCurrentStore] = useState(() => loadCurrentStore());
  const [settings,     setSettings]     = useState(() => loadSettings());

  const handleSessionEnd = useCallback((finishedSession) => {
    setSessions(prev => {
      const next = [...prev, finishedSession];
      saveSessions(next);
      return next;
    });
  }, []);

  const handleStoreChange = useCallback((name) => {
    setCurrentStore(name);
    saveCurrentStore(name);
  }, []);

  const handleClear = useCallback(() => {
    setSessions([]);
    saveSessions([]);
  }, []);

  const handleSettingsSave = useCallback((s) => setSettings(s), []);

  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', maxWidth: 480, margin: '0 auto', position: 'relative' }}
    >
      {/* ── グローバルヘッダー ── */}
      <header className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-arcade-border
                         flex items-center justify-between bg-arcade-bg">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="#080810" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          </div>
          <span className="text-arcade-text text-base font-bold tracking-tight">
            クレーン<span style={{ color: '#f59e0b' }}>Ana</span>
          </span>
        </div>
        <span className="text-arcade-muted text-xs">{sessions.length}件記録済み</span>
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
        {tab === 'dash' && (
          <Dashboard sessions={sessions} />
        )}
        {tab === 'history' && (
          <HistoryScreen sessions={sessions} onClear={handleClear} />
        )}
        {tab === 'settings' && (
          <SettingsScreen settings={settings} onSave={handleSettingsSave} />
        )}
      </main>

      {/* ── ボトムナビ ── */}
      <nav className="flex-shrink-0 border-t border-arcade-border bg-arcade-card flex">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="no-select flex-1 flex flex-col items-center justify-center
                         py-3 gap-1 cursor-pointer transition-colors duration-150"
              style={{ minHeight: 58, background: 'none', border: 'none' }}
              aria-label={label}
            >
              <Icon size={22} color={active ? '#f59e0b' : '#6b7280'} />
              <span className="text-xs font-medium"
                style={{ color: active ? '#f59e0b' : '#6b7280' }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
