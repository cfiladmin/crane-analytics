import { useState, useMemo } from 'react';
import { MACHINE_TYPES, calcStoreStats, formatYen } from '../utils/analytics';
import { MachineIcon, IconWarning, IconCheck } from './Icons';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function MovementBadge({ movId }) {
  const map = {
    great:  { label: '神動', color: '#2563EB' },
    normal: { label: '標準', color: '#059669' },
    small:  { label: '微動', color: '#D97706' },
  };
  const m = map[movId] ?? map.normal;
  return <p className="font-num text-sm font-semibold" style={{ color: m.color }}>{m.label}</p>;
}

export default function HistoryScreen({ sessions, onClear }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [storeFilter,  setStoreFilter]  = useState('all');
  const [sortOrder,    setSortOrder]    = useState('date_desc');

  // ── 店舗リスト生成 ──────────────────────────────
  const storeStats = useMemo(() => calcStoreStats(sessions), [sessions]);
  const storeNames  = useMemo(() => {
    const names = [...new Set(sessions.map(s => s.storeName || '（未設定）'))];
    return names.sort();
  }, [sessions]);

  // ── フィルタ＆ソート ─────────────────────────────
  const filtered = useMemo(() => {
    let list = storeFilter === 'all'
      ? [...sessions]
      : sessions.filter(s => (s.storeName || '（未設定）') === storeFilter);

    switch (sortOrder) {
      case 'date_desc':  list.sort((a,b) => new Date(b.date) - new Date(a.date)); break;
      case 'cost_desc':  list.sort((a,b) => b.totalSpent - a.totalSpent);         break;
      case 'won_first':  list.sort((a,b) => (b.won ? 1 : 0) - (a.won ? 1 : 0)); break;
    }
    return list;
  }, [sessions, storeFilter, sortOrder]);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-arcade-subtext text-sm">履歴がまだありません</p>
        <p className="text-arcade-muted text-xs mt-1">プレイを記録すると、ここに表示されます</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto animate-fade-in bg-arcade-bg">

      {/* ── ヘッダー ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-arcade-text text-base font-semibold">
          履歴
          <span className="text-arcade-muted font-normal text-sm ml-1.5">
            ({filtered.length}/{sessions.length}件)
          </span>
        </h2>
        {!confirmClear ? (
          <button onClick={() => setConfirmClear(true)}
            className="text-arcade-muted text-xs border border-arcade-border rounded-xl px-3 py-1 cursor-pointer bg-arcade-card">
            全消去
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { onClear(); setConfirmClear(false); }}
              className="text-white text-xs bg-red-500 rounded-xl px-3 py-1 cursor-pointer">
              消去する
            </button>
            <button onClick={() => setConfirmClear(false)}
              className="text-arcade-muted text-xs border border-arcade-border rounded-xl px-3 py-1 cursor-pointer bg-arcade-card">
              キャンセル
            </button>
          </div>
        )}
      </div>

      {/* ── 店舗フィルタ ── */}
      {storeNames.length > 1 && (
        <div className="px-4 mb-2 flex-shrink-0">
          <p className="text-arcade-muted text-xs mb-1.5">店舗でフィルタ</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setStoreFilter('all')}
              className="no-select flex-shrink-0 text-xs px-3 py-1.5 rounded-xl cursor-pointer
                         border transition-colors duration-150"
              style={{
                background:   storeFilter === 'all' ? '#FEF3C7' : '#FFFFFF',
                borderColor:  storeFilter === 'all' ? '#D97706' : '#E2E8F0',
                color:        storeFilter === 'all' ? '#D97706' : '#94A3B8',
              }}>
              すべて
            </button>
            {storeNames.map(name => (
              <button key={name}
                onClick={() => setStoreFilter(name)}
                className="no-select flex-shrink-0 text-xs px-3 py-1.5 rounded-xl cursor-pointer
                           border transition-colors duration-150"
                style={{
                  background:  storeFilter === name ? '#FEF3C7' : '#FFFFFF',
                  borderColor: storeFilter === name ? '#D97706' : '#E2E8F0',
                  color:       storeFilter === name ? '#D97706' : '#94A3B8',
                }}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ソート ── */}
      <div className="px-4 mb-3 flex gap-1.5 flex-shrink-0">
        {[
          { id: 'date_desc', label: '新しい順'  },
          { id: 'cost_desc', label: '投資額順'  },
          { id: 'won_first', label: 'GET優先'   },
        ].map(opt => (
          <button key={opt.id}
            onClick={() => setSortOrder(opt.id)}
            className="no-select text-xs px-2.5 py-1 rounded-lg cursor-pointer border"
            style={{
              background:  sortOrder === opt.id ? '#EFF6FF' : '#FFFFFF',
              borderColor: sortOrder === opt.id ? '#2563EB' : '#E2E8F0',
              color:       sortOrder === opt.id ? '#2563EB' : '#94A3B8',
            }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── 店舗ヒートマップ ── */}
      {storeStats.length > 1 && storeFilter === 'all' && (
        <div className="mx-4 mb-3 bg-arcade-card border border-arcade-border rounded-2xl p-3 flex-shrink-0 shadow-bento">
          <p className="text-arcade-text text-xs font-semibold mb-2">店舗別 平均獲得コスト</p>
          <div className="space-y-1.5">
            {storeStats.map(st => {
              const avg = st.wins > 0
                ? Math.round(st.sessions.filter(s=>s.won).reduce((a,s)=>a+s.totalSpent,0)/st.wins)
                : null;
              const maxSpent = Math.max(...storeStats.map(s => s.spent), 1);
              const barWidth = Math.round((st.spent / maxSpent) * 100);
              return (
                <div key={st.name}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-arcade-subtext text-xs truncate max-w-32">{st.name}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-arcade-muted">{st.sessions.length}回</span>
                      <span className="font-num text-arcade-text">
                        {avg ? formatYen(avg) : '獲得なし'}
                      </span>
                      {avg && avg <= 2000
                        ? <span className="text-green-600 font-semibold">◎甘</span>
                        : avg && avg >= 3500
                          ? <span className="text-red-600 font-semibold">✕渋</span>
                          : avg ? <span className="text-amber-600 font-semibold">△普通</span> : null}
                    </div>
                  </div>
                  <div className="h-1.5 bg-arcade-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                         style={{
                           width: `${barWidth}%`,
                           background: avg && avg <= 2000
                             ? 'linear-gradient(90deg,#059669,#34d399)'
                             : avg && avg >= 3500
                               ? 'linear-gradient(90deg,#DC2626,#F87171)'
                               : 'linear-gradient(90deg,#D97706,#FCD34D)',
                         }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── セッション一覧 ── */}
      <div className="flex flex-col gap-2 px-4">
        {filtered.map(s => {
          const machine  = MACHINE_TYPES.find(m => m.id === s.machineId);
          const isSwamp  = s.totalSpent >= 3000 && !s.won;
          const profit   = s.won && s.prizeValue > 0 ? s.prizeValue - s.totalSpent : null;

          return (
            <div key={s.id}
              className="bg-arcade-card rounded-2xl p-3 shadow-bento"
              style={{
                border: s.won
                  ? '1.5px solid #BBF7D0'
                  : isSwamp ? '1.5px solid #FECACA' : '1.5px solid #E2E8F0',
              }}>
              {/* ヘッダー行 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MachineIcon machineId={machine?.icon || s.machineId} size={16} color={machine?.color ?? '#94A3B8'} />
                  <div>
                    <span className="text-arcade-text text-xs font-medium">{machine?.labelLong ?? s.machineId}</span>
                    {s.storeName && (
                      <span className="text-arcade-muted text-xs ml-1.5">@{s.storeName}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {s.won
                    ? <><IconCheck size={13} color="#059669" /><span className="text-green-600 text-xs font-semibold">GET</span></>
                    : isSwamp
                      ? <><IconWarning size={13} color="#DC2626" /><span className="text-red-600 text-xs">沼撤退</span></>
                      : <span className="text-arcade-muted text-xs">撤退</span>
                  }
                </div>
              </div>

              {/* 数値行 */}
              <div className="flex items-end justify-between">
                <div className="flex gap-3">
                  <div>
                    <p className="text-arcade-muted text-xs">投資</p>
                    <p className="font-num text-arcade-text text-sm font-semibold">
                      {formatYen(s.totalSpent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-arcade-muted text-xs">手数</p>
                    <p className="font-num text-arcade-text text-sm font-semibold">
                      {s.plays.length}手
                    </p>
                  </div>
                  {s.plays.length > 0 && (
                    <div>
                      <p className="text-arcade-muted text-xs">最終動き</p>
                      <MovementBadge movId={s.plays[s.plays.length - 1].movement} />
                    </div>
                  )}
                  {profit !== null && (
                    <div>
                      <p className="text-arcade-muted text-xs">収支</p>
                      <p className="font-num text-sm font-bold"
                         style={{ color: profit >= 0 ? '#059669' : '#DC2626' }}>
                        {profit >= 0 ? '+' : ''}{formatYen(profit)}
                      </p>
                    </div>
                  )}
                </div>
                <span className="text-arcade-muted text-xs">{formatDate(s.date)}</span>
              </div>

              {/* 動き履歴バー */}
              {s.plays.length > 0 && (
                <div className="flex gap-0.5 mt-2 h-1.5 rounded-full overflow-hidden">
                  {s.plays.map((p, i) => {
                    const c = p.movement === 'great' ? '#2563EB'
                            : p.movement === 'normal' ? '#059669' : '#D97706';
                    return <div key={i} className="flex-1 rounded-sm" style={{ background: c }} />;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-4 flex-shrink-0" />
    </div>
  );
}
