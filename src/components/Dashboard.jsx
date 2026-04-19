import { useCallback, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import {
  MACHINE_TYPES, MOVEMENT_LEVELS,
  calcStats, calcEta, formatYen
} from '../utils/analytics';
import { IconTrophy, IconWarning, MachineIcon } from './Icons';

// ── [新機能3] η シェア画像生成 ───────────────────────────
function buildEtaCanvas(eta, sessionCount) {
  const W = 1080, H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 背景グラデーション（スキルレベルで変化）
  const grd = ctx.createLinearGradient(0, 0, W, H);
  if (eta >= 1.0) {
    grd.addColorStop(0, '#F0FDF4'); grd.addColorStop(1, '#DCFCE7');
  } else if (eta >= 0.7) {
    grd.addColorStop(0, '#FFFBEB'); grd.addColorStop(1, '#FEF3C7');
  } else {
    grd.addColorStop(0, '#FEF2F2'); grd.addColorStop(1, '#FFE4E6');
  }
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // カード背景（白・角丸）
  const pad = 60;
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, 48);
  ctx.fill();

  // アクセントカラー
  const accent = eta >= 1.0 ? '#059669' : eta >= 0.7 ? '#D97706' : '#DC2626';

  // 上部カラーバー
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(pad, pad, W - pad * 2, 14, [48, 48, 0, 0]);
  ctx.fill();

  // ラベル「技術習熟度」
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText('技術習熟度', W / 2, 230);

  // η記号
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 80px system-ui, sans-serif';
  ctx.fillText('η (eta)', W / 2, 340);

  // 大きなパーセンテージ
  const etaPct = Math.round(eta * 100);
  ctx.fillStyle = accent;
  ctx.font = `bold 300px "Courier New", monospace`;
  ctx.fillText(`${etaPct}%`, W / 2, 660);

  // ランク
  const rank = eta >= 1.0 ? '🏆 エキスパート' : eta >= 0.7 ? '⚡ 標準水準' : '🌱 成長中';
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 60px system-ui, sans-serif';
  ctx.fillText(rank, W / 2, 780);

  // セッション数
  ctx.fillStyle = '#94A3B8';
  ctx.font = '40px system-ui, sans-serif';
  ctx.fillText(`${sessionCount} セッション記録`, W / 2, 860);

  // 区切り線
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 160, 910); ctx.lineTo(W / 2 + 160, 910);
  ctx.stroke();

  // アプリ名
  ctx.fillStyle = '#D97706';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillText('クレーンAna', W / 2, 970);

  // ハッシュタグ
  ctx.fillStyle = '#94A3B8';
  ctx.font = '32px system-ui, sans-serif';
  ctx.fillText('#クレーンゲーム #UFOキャッチャー攻略', W / 2, 1020);

  return canvas;
}

function useShareEta(eta, sessions) {
  return useCallback(async () => {
    const canvas = buildEtaCanvas(eta, sessions.length);

    if (navigator.canShare) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'crane-eta.png', { type: 'image/png' });
        try {
          await navigator.share({
            files: [file],
            text: `クレーンゲームの技術係数 η=${Math.round(eta * 100)}%！ #クレーンAna #UFOキャッチャー攻略`,
          });
        } catch {
          // シェアキャンセル or 非対応 → ダウンロード
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = `crane-eta-${Date.now()}.png`;
          a.click();
        }
      }, 'image/png');
    } else {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `crane-eta-${Date.now()}.png`;
      a.click();
    }
  }, [eta, sessions]);
}

// ── カスタムツールチップ ──────────────────────────────
const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-arcade-card border border-arcade-border rounded-xl px-3 py-2 text-xs shadow-bento-md">
      {label && <p className="text-arcade-subtext mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-num" style={{ color: p.color ?? p.fill ?? '#0F172A' }}>
          {p.name}: {typeof p.value === 'number' && p.value >= 500
            ? formatYen(p.value) : p.value}
          {p.unit ?? ''}
        </p>
      ))}
    </div>
  );
};

// ── スタットカード ────────────────────────────────────
function StatCard({ label, value, sub, color = '#D97706', icon, highlight }) {
  return (
    <div
      className="bg-arcade-card rounded-2xl p-3 flex flex-col shadow-bento"
      style={{ border: `1.5px solid ${highlight ? `${color}40` : '#E2E8F0'}` }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-arcade-subtext text-xs">{label}</span>
        {icon}
      </div>
      <span className="font-num font-bold text-xl leading-tight" style={{ color }}>{value}</span>
      {sub && <span className="text-arcade-muted text-xs mt-0.5">{sub}</span>}
    </div>
  );
}

const PERIODS = [
  { id: 'all',   label: '全期間' },
  { id: 'today', label: '今日'   },
  { id: 'week',  label: '今週'   },
  { id: 'month', label: '今月'   },
];

function filterByPeriod(sessions, period) {
  const now = new Date();
  switch (period) {
    case 'today':
      return sessions.filter(s => new Date(s.date).toDateString() === now.toDateString());
    case 'week': {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      return sessions.filter(s => new Date(s.date) >= weekAgo);
    }
    case 'month':
      return sessions.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    default: return sessions;
  }
}

export default function Dashboard({ sessions }) {
  const [period, setPeriod] = useState('all');
  const filtered = useMemo(() => filterByPeriod(sessions, period), [sessions, period]);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-14 h-14 bg-arcade-cardAlt border border-arcade-border rounded-full
                        flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
        </div>
        <p className="text-arcade-subtext text-sm">まだデータがありません</p>
        <p className="text-arcade-muted text-xs mt-1">「プレイ」タブで記録を始めましょう</p>
      </div>
    );
  }

  const stats    = calcStats(filtered);
  const eta      = calcEta(filtered);
  const etaPct   = Math.round(eta * 100);
  const shareEta = useShareEta(eta, filtered);

  // ── 機種別集計 ────────────────────────────────────
  const machineStats = MACHINE_TYPES.map(m => {
    const s = filtered.filter(ss => ss.machineId === m.id);
    if (s.length === 0) return null;
    const spent = s.reduce((a, ss) => a + ss.totalSpent, 0);
    const wins  = s.filter(ss => ss.won).length;
    const avg   = wins > 0
      ? Math.round(s.filter(ss=>ss.won).reduce((a,ss)=>a+ss.totalSpent,0)/wins) : 0;
    return { name: m.label.replace('橋渡し（','').replace('）',''), spent, wins, avg, count: s.length, color: m.color };
  }).filter(Boolean);

  // ── 直近10セッション推移 ──────────────────────────
  const trendData = filtered.slice(-10).map((s, i) => ({
    n:     i + 1,
    spent: s.totalSpent,
    label: s.won ? 'GET' : '撤退',
  }));

  // ── ROI ある景品 ─────────────────────────────────
  const roiItems = filtered
    .filter(s => s.won && s.prizeValue > 0)
    .slice(-8)
    .map((s, i) => {
      const m = MACHINE_TYPES.find(m => m.id === s.machineId);
      return {
        name:    `${i+1}`,
        cost:    s.totalSpent,
        value:   s.prizeValue,
        profit:  s.prizeValue - s.totalSpent,
        machine: m?.label ?? '',
      };
    });

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3 animate-fade-in bg-arcade-bg">

      {/* ── 期間フィルタ ── */}
      <div className="flex gap-1.5">
        {PERIODS.map(p => (
          <button key={p.id} onClick={() => setPeriod(p.id)}
            className="no-select flex-1 text-xs py-2 rounded-xl cursor-pointer border font-semibold transition-colors"
            style={{
              background:  period === p.id ? '#FEF3C7' : '#fff',
              borderColor: period === p.id ? '#D97706' : '#E2E8F0',
              color:       period === p.id ? '#D97706' : '#94A3B8',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-arcade-subtext text-sm">この期間のデータがありません</p>
        </div>
      )}

      {/* ── KPI グリッド 2×3 ── */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="総投資額"
          value={formatYen(stats.totalSpent)}
          sub={`${sessions.length}セッション`}
          color="#D97706"
        />
        <StatCard
          label="平均獲得単価"
          value={stats.avgCostPerWin > 0 ? formatYen(stats.avgCostPerWin) : '—'}
          sub={`勝率 ${stats.winRate}%`}
          color="#059669"
          icon={<IconTrophy size={13} color="#059669" />}
        />
        <StatCard
          label="損切り成功率"
          value={`${stats.retreatSuccessRate}%`}
          sub={`${stats.retreatSuccessCount}/${stats.alertSessions}回 アラートに従った`}
          color={stats.retreatSuccessRate >= 70 ? '#059669' : stats.retreatSuccessRate >= 40 ? '#D97706' : '#DC2626'}
          highlight={stats.retreatSuccessRate > 0}
        />
        <StatCard
          label="沼セッション"
          value={`${stats.swampCount}回`}
          sub="¥3000超え撤退"
          color={stats.swampCount > 0 ? '#DC2626' : '#94A3B8'}
          icon={stats.swampCount > 0 ? <IconWarning size={13} color="#DC2626" /> : null}
        />
        {stats.totalPrizeValue > 0 ? (
          <StatCard
            label="景品合計相場"
            value={formatYen(stats.totalPrizeValue)}
            sub={`対獲得コスト`}
            color="#7C3AED"
          />
        ) : (
          <StatCard
            label="獲得数"
            value={`${stats.totalWins}個`}
            sub="景品価値を入力するとROI表示"
            color="#7C3AED"
          />
        )}
        <StatCard
          label={stats.totalROI >= 0 ? 'ROI プラス' : 'ROI マイナス'}
          value={stats.totalPrizeValue > 0
            ? `${stats.totalROI >= 0 ? '+' : ''}${stats.totalROI}%`
            : '—'}
          sub={stats.totalPrizeValue > 0 ? '獲得コスト対メルカリ相場' : '獲得時に景品価値を入力'}
          color={stats.totalROI >= 0 ? '#059669' : '#DC2626'}
          highlight={stats.totalPrizeValue > 0}
        />
      </div>

      {/* ── 技術習熟度 η ── */}
      <div className="bg-arcade-card border border-arcade-border rounded-2xl p-4 shadow-bento">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-arcade-text text-sm font-semibold">技術習熟度 η</p>
            <p className="text-arcade-muted text-xs mt-0.5">
              E[N] = D / (m · η) &nbsp;·&nbsp; η = Σ理論手数 / Σ実手数
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* [新機能3] シェアボタン */}
            <button
              onClick={shareEta}
              className="no-select flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl cursor-pointer border transition-all"
              style={{ background: '#F1F5F9', borderColor: '#E2E8F0', color: '#475569' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              シェア
            </button>
            <span className="font-num text-2xl font-bold"
              style={{ color: eta >= 1.0 ? '#059669' : eta >= 0.7 ? '#D97706' : '#DC2626' }}>
              {etaPct}%
            </span>
          </div>
        </div>

        {/* ゲージバー */}
        <div className="h-3 bg-arcade-border rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, etaPct)}%`,
              background: eta >= 1.0
                ? 'linear-gradient(90deg, #059669, #34d399)'
                : eta >= 0.7
                  ? 'linear-gradient(90deg, #D97706, #FCD34D)'
                  : 'linear-gradient(90deg, #DC2626, #F87171)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-arcade-muted mb-2">
          <span>初心者</span>
          <span>← 初期値 η=0.8 →</span>
          <span>エキスパート</span>
        </div>

        {/* η インサイト */}
        <div className="rounded-xl p-2 text-xs"
          style={{
            background: eta >= 1.0 ? '#F0FDF4' : eta >= 0.7 ? '#FFFBEB' : '#FEF2F2',
            border:     eta >= 1.0 ? '1px solid #BBF7D0' : eta >= 0.7 ? '1px solid #FDE68A' : '1px solid #FECACA',
          }}>
          {eta >= 1.0 && (
            <p className="text-green-700">
              理論値を超える精度です。理想的なアーム操作ができています。
            </p>
          )}
          {eta >= 0.7 && eta < 1.0 && (
            <p className="text-amber-700">
              標準水準（初期値0.8）前後。あと数回の獲得で精度が向上します。
            </p>
          )}
          {eta < 0.7 && (
            <p className="text-red-600">
              技術的ロスが大きい。動き評価の記録精度も再確認してください。
            </p>
          )}
        </div>
      </div>

      {/* ── 直近推移 ── */}
      {trendData.length >= 2 && (
        <div className="bg-arcade-card border border-arcade-border rounded-2xl p-4 shadow-bento">
          <p className="text-arcade-text text-sm font-semibold mb-3">直近の投資推移</p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="n" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                tickFormatter={v => `¥${(v/1000).toFixed(1)}k`}
              />
              <Tooltip content={<LightTooltip />} />
              <Line
                type="monotone" dataKey="spent" stroke="#D97706"
                strokeWidth={2} dot={{ fill: '#D97706', r: 3, strokeWidth: 0 }}
                name="投資額"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── 機種別投資 ── */}
      {machineStats.length > 0 && (
        <div className="bg-arcade-card border border-arcade-border rounded-2xl p-4 shadow-bento">
          <p className="text-arcade-text text-sm font-semibold mb-3">機種別 投資額</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={machineStats} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9 }} />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 9 }}
                tickFormatter={v => `¥${(v/1000).toFixed(0)}k`}
              />
              <Tooltip content={<LightTooltip />} />
              <Bar dataKey="spent" name="投資額" radius={[4,4,0,0]}>
                {machineStats.map((m, i) => (
                  <Cell key={i} fill={m.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* 機種別 平均獲得コスト */}
          <div className="mt-3 space-y-1.5">
            {machineStats.filter(m => m.wins > 0).map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-arcade-subtext text-xs">{m.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-arcade-muted text-xs">{m.wins}獲得</span>
                  <span className="font-num text-xs font-semibold" style={{ color: m.color }}>
                    平均 {formatYen(m.avg)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 景品ROI チャート ── */}
      {roiItems.length > 0 && (
        <div className="bg-arcade-card border border-arcade-border rounded-2xl p-4 shadow-bento">
          <p className="text-arcade-text text-sm font-semibold mb-1">景品 ROI 分析</p>
          <p className="text-arcade-muted text-xs mb-3">投資コスト vs メルカリ相場</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={roiItems} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }}
                tickFormatter={v => `¥${(v/1000).toFixed(1)}k`} />
              <Tooltip content={<LightTooltip />} />
              <Bar dataKey="cost"  name="投資コスト" fill="#D97706" radius={[2,2,0,0]} />
              <Bar dataKey="value" name="メルカリ相場" fill="#7C3AED" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{background:'#D97706'}} />
              <span className="text-arcade-muted">投資コスト</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{background:'#7C3AED'}} />
              <span className="text-arcade-muted">メルカリ相場</span>
            </span>
          </div>
        </div>
      )}

      {/* ── 確率機 沼ログ ── */}
      {(() => {
        const probSessions = filtered.filter(s => s.isProbMachine);
        if (probSessions.length === 0) return null;
        const probSpent = probSessions.reduce((a, s) => a + s.totalSpent, 0);
        const probWins  = probSessions.filter(s => s.won).length;
        const avgProb   = probWins > 0
          ? Math.round(probSessions.filter(s=>s.won).reduce((a,s)=>a+s.totalSpent,0)/probWins)
          : null;
        return (
          <div className="bg-arcade-card rounded-2xl p-4 shadow-bento"
               style={{ border: '1.5px solid #FECACA' }}>
            <div className="flex items-center gap-2 mb-3">
              <IconWarning size={14} color="#DC2626" />
              <p className="text-red-600 text-sm font-semibold">確率機 沼ログ</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-num text-red-600 text-lg font-bold">{formatYen(probSpent)}</p>
                <p className="text-arcade-muted text-xs">総投資</p>
              </div>
              <div>
                <p className="font-num text-amber-600 text-lg font-bold">{probWins}</p>
                <p className="text-arcade-muted text-xs">獲得数</p>
              </div>
              <div>
                <p className="font-num text-arcade-text text-lg font-bold">
                  {avgProb ? formatYen(avgProb) : '—'}
                </p>
                <p className="text-arcade-muted text-xs">平均獲得単価</p>
              </div>
            </div>
            <p className="text-arcade-muted text-xs mt-2 border-t border-arcade-border pt-2">
              ※ カウンター設定が非公開のため、N_sys はデフォルト30手で推算
            </p>
          </div>
        );
      })()}

      {/* ── 動き評価の凡例（参照用） ── */}
      <div className="bg-arcade-card border border-arcade-border rounded-2xl p-3 shadow-bento">
        <p className="text-arcade-subtext text-xs font-medium mb-2">動き評価の定義</p>
        <div className="space-y-1.5">
          {MOVEMENT_LEVELS.map(lv => (
            <div key={lv.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: lv.color }} />
                <span className="text-xs font-semibold" style={{ color: lv.color }}>
                  {lv.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-arcade-muted">
                <span className="font-num">{lv.mm}mm/手</span>
                <span>{lv.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-arcade-muted text-xs mt-2 border-t border-arcade-border pt-2">
          PDFデータ：橋渡し標準14手×15mm≈210mm / 広設定9手×22mm≈198mm / 狭設定35手×8mm≈280mm
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}
