import { useState, useCallback, useRef, useEffect } from 'react';
import {
  MACHINE_TYPES, MOVEMENT_LEVELS,
  calcExpected, shouldRetreat, createSession,
  formatYen, calcEta, loadStoreList
} from '../utils/analytics';
import { MachineIcon, IconWarning, IconCheck } from './Icons';

// ══════════════════════════════════════════════════════════
// GET結果カード画像生成
// ══════════════════════════════════════════════════════════
function buildGetCanvas({ prizeName, totalSpent, prizeValue, roiPct, machineName, storeName }) {
  const W = 1080, H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const isPlus = roiPct !== null && roiPct >= 0;
  const hasROI = prizeValue > 0;

  // ── 背景グラデーション ──
  const grd = ctx.createLinearGradient(0, 0, W, H);
  if (hasROI && isPlus) {
    grd.addColorStop(0, '#064e3b'); grd.addColorStop(1, '#065f46');
  } else if (hasROI) {
    grd.addColorStop(0, '#1e1b4b'); grd.addColorStop(1, '#312e81');
  } else {
    grd.addColorStop(0, '#1c1917'); grd.addColorStop(1, '#292524');
  }
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // ── 光彩エフェクト ──
  const radGrd = ctx.createRadialGradient(W/2, H*0.4, 50, W/2, H*0.4, 500);
  radGrd.addColorStop(0, hasROI && isPlus ? 'rgba(52,211,153,0.18)' : 'rgba(245,158,11,0.15)');
  radGrd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radGrd;
  ctx.fillRect(0, 0, W, H);

  // ── カード白枠 ──
  const pad = 64;
  ctx.save();
  ctx.shadowColor = hasROI && isPlus ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.3)';
  ctx.shadowBlur = 60;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.roundRect(pad, pad, W-pad*2, H-pad*2, 56);
  ctx.fill();
  ctx.restore();

  // ── ボーダー ──
  ctx.strokeStyle = hasROI && isPlus ? 'rgba(52,211,153,0.5)' : 'rgba(245,158,11,0.4)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(pad, pad, W-pad*2, H-pad*2, 56);
  ctx.stroke();

  const accentColor = hasROI && isPlus ? '#34d399' : '#f59e0b';

  // ── GET！大見出し ──
  ctx.textAlign = 'center';
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 100px system-ui, sans-serif';
  ctx.fillText('🎉  GET！', W/2, 220);

  // ── 区切り線 ──
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad+80, 260); ctx.lineTo(W-pad-80, 260);
  ctx.stroke();

  // ── 景品名 ──
  const name = prizeName || '景品を獲得';
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${name.length > 12 ? 62 : 72}px system-ui, sans-serif`;
  // 長い場合は折り返し
  if (name.length > 16) {
    ctx.font = 'bold 54px system-ui, sans-serif';
    const half = Math.ceil(name.length/2);
    ctx.fillText(name.slice(0, half), W/2, 360);
    ctx.fillText(name.slice(half), W/2, 430);
  } else {
    ctx.fillText(name, W/2, 390);
  }

  // ── 数値ブロック ──
  const blockY = 510;
  const blockH = 140;
  const cols   = hasROI ? 3 : 2;
  const blockW = (W - pad*2 - 32*(cols-1)) / cols;

  const blocks = hasROI
    ? [
        { label: '投資額',   value: formatYen(totalSpent), color: '#94a3b8' },
        { label: 'メルカリ相場', value: formatYen(prizeValue), color: '#94a3b8' },
        { label: 'ROI',      value: `${roiPct >= 0 ? '+' : ''}${roiPct}%`, color: accentColor },
      ]
    : [
        { label: '投資額',   value: formatYen(totalSpent), color: '#94a3b8' },
        { label: '機種',     value: (machineName || '').slice(0, 8), color: '#94a3b8' },
      ];

  blocks.forEach((b, i) => {
    const bx = pad + i*(blockW+32);
    // ブロック背景
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.roundRect(bx, blockY, blockW, blockH, 24);
    ctx.fill();
    // ラベル
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '32px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(b.label, bx + blockW/2, blockY + 46);
    // 値
    ctx.fillStyle = b.color;
    ctx.font = `bold ${b.value.length > 7 ? 36 : 44}px system-ui, sans-serif`;
    ctx.fillText(b.value, bx + blockW/2, blockY + 108);
  });

  // ── 店舗名 ──
  if (storeName) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '34px system-ui, sans-serif';
    ctx.fillText(`📍 ${storeName}`, W/2, blockY + blockH + 60);
  }

  // ── 区切り ──
  const divY = storeName ? blockY+blockH+100 : blockY+blockH+50;
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad+80, divY); ctx.lineTo(W-pad-80, divY);
  ctx.stroke();

  // ── ハッシュタグ ──
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '34px system-ui, sans-serif';
  ctx.fillText('#クレーンゲーム #クレゲ', W/2, divY+60);

  // ── アプリ名 ──
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.fillText('クレーンAna', W/2, divY+130);

  // ── URL ──
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillText('crane-analytics.vercel.app', W/2, divY+178);

  return canvas;
}

// ══════════════════════════════════════════════════════════
// 店舗名バー + 変更ボトムシート
// ══════════════════════════════════════════════════════════
function StoreBar({ currentStore, onStoreChange }) {
  const [open, setOpen]   = useState(false);
  const [input, setInput] = useState('');
  const storeList         = loadStoreList();
  const inputRef          = useRef(null);

  const handleOpen = () => {
    setInput(currentStore);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };
  const handleConfirm = (name) => {
    onStoreChange(name.trim());
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="no-select w-full flex items-center justify-between
                   px-4 py-2 cursor-pointer border-b border-arcade-border bg-arcade-cardAlt"
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          <span className="text-sm font-medium"
            style={{ color: currentStore ? '#0F172A' : '#94A3B8' }}>
            {currentStore || '店舗を設定（タップ）'}
          </span>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
             stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end animate-slide-up"
             style={{ background: 'rgba(15,23,42,0.45)' }}
             onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="rounded-t-3xl p-5 flex flex-col gap-4 bg-arcade-card shadow-bento-lg"
               style={{ border: '1px solid #E2E8F0', borderBottom: 'none' }}>
            <p className="text-arcade-text text-base font-semibold">現在の店舗を設定</p>
            <input
              ref={inputRef}
              type="text" placeholder="例：ラウンドワン渋谷店"
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConfirm(input)}
              className="bg-arcade-bg border border-arcade-border rounded-xl
                         px-3 py-2.5 text-arcade-text text-base outline-none focus:border-amber-500"
            />
            {storeList.length > 0 && (
              <div>
                <p className="text-arcade-muted text-xs mb-2">最近の店舗</p>
                <div className="flex flex-wrap gap-2">
                  {storeList.slice(-6).reverse().map(s => (
                    <button key={s} onClick={() => handleConfirm(s)}
                      className="no-select text-xs px-3 py-1.5 rounded-xl cursor-pointer
                                 border border-arcade-border text-arcade-subtext bg-arcade-cardAlt">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => handleConfirm(input)}
                className="no-select flex-1 py-3 rounded-2xl font-bold text-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
                設定する
              </button>
              <button onClick={() => setOpen(false)}
                className="no-select px-4 py-3 rounded-2xl text-arcade-muted border border-arcade-border cursor-pointer bg-arcade-cardAlt">
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════
// 機種選択画面
// ══════════════════════════════════════════════════════════
function MachineSelectScreen({ sessions, currentStore, onSelect, onStoreChange }) {
  const bridgeMachines = MACHINE_TYPES.filter(m => m.category === 'bridge');
  const otherMachines  = MACHINE_TYPES.filter(m => m.category !== 'bridge');

  return (
    <div className="flex flex-col h-full overflow-y-auto animate-fade-in bg-arcade-bg">
      <StoreBar currentStore={currentStore} onStoreChange={onStoreChange} />

      <div className="p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-arcade-text text-base font-semibold">機種を選ぶ</h2>
          <p className="text-arcade-subtext text-xs">1タップで記録開始</p>
        </div>

        {/* 橋渡しセクション */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MachineIcon machineId="bridge" size={16} color="#2563EB" />
            <span className="text-arcade-text text-sm font-semibold">橋渡し</span>
            <span className="text-arcade-muted text-xs">— 景品サイズを選択</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {bridgeMachines.map(m => (
              <button key={m.id} onClick={() => onSelect(m.id, m.isProbDefault)}
                className="no-select btn-press flex items-center gap-3
                           bg-arcade-card border border-arcade-border rounded-2xl px-3 py-2.5
                           cursor-pointer text-left transition-all duration-150 shadow-bento"
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = m.color;
                  e.currentTarget.style.background  = `${m.color}0D`;
                  e.currentTarget.style.boxShadow   = `0 4px 16px ${m.color}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background  = '#FFFFFF';
                  e.currentTarget.style.boxShadow   = '';
                }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                     style={{ background: `${m.color}12`, border: `1.5px solid ${m.color}35` }}>
                  <span className="font-num font-bold text-sm leading-none" style={{ color: m.color }}>{m.D}</span>
                  <span className="text-xs" style={{ color: `${m.color}88` }}>mm</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-arcade-text text-sm font-semibold">{m.label}</p>
                  <p className="text-arcade-muted text-xs truncate">{m.prizeHint}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: `${m.color}BB` }}>{m.physicsNote}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* その他機種 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-arcade-text text-sm font-semibold">その他の機種</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {otherMachines.map(m => (
              <button key={m.id} onClick={() => onSelect(m.id, m.isProbDefault)}
                className="no-select btn-press flex flex-col items-center justify-center gap-1.5
                           bg-arcade-card border border-arcade-border rounded-2xl p-3
                           cursor-pointer transition-all duration-150 shadow-bento"
                style={{ minHeight: '80px' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = m.color;
                  e.currentTarget.style.background  = `${m.color}0D`;
                  e.currentTarget.style.boxShadow   = `0 4px 16px ${m.color}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background  = '#FFFFFF';
                  e.currentTarget.style.boxShadow   = '';
                }}>
                <MachineIcon machineId={m.icon} size={22} color={m.color} />
                <span className="text-arcade-text text-xs font-medium text-center leading-tight">{m.label}</span>
                {m.D > 0
                  ? <span className="font-num text-xs" style={{ color: `${m.color}99` }}>D={m.D}mm</span>
                  : <span className="text-xs font-semibold" style={{ color: m.color }}>確率機</span>}
              </button>
            ))}
          </div>
          <div className="mt-2 px-3 py-2 rounded-xl text-xs"
               style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <span className="text-red-600 font-semibold">ぬいぐるみ（確率機）</span>
            <span className="text-arcade-muted ml-1">
              — 物理移動より「投入金額」と「天井(N_sys)」を管理。N_sys=30手で計算。
            </span>
          </div>
        </div>

        {/* 直近セッション */}
        {sessions.length > 0 && (
          <div>
            <p className="text-arcade-subtext text-xs mb-2">直近の記録</p>
            {sessions.slice(-3).reverse().map(s => {
              const m = MACHINE_TYPES.find(m => m.id === s.machineId);
              return (
                <div key={s.id}
                  className="flex items-center justify-between bg-arcade-card
                             border border-arcade-border rounded-xl px-3 py-2 mb-1.5 shadow-bento">
                  <div className="flex items-center gap-2">
                    <MachineIcon machineId={m?.icon || s.machineId} size={14} color={m?.color ?? '#94A3B8'} />
                    <div>
                      <span className="text-arcade-subtext text-xs">{m?.labelLong ?? s.machineId}</span>
                      {s.storeName && <span className="text-arcade-muted text-xs ml-2">@{s.storeName}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-num text-arcade-text text-xs">{formatYen(s.totalSpent)}</span>
                    {s.won ? <IconCheck size={12} color="#059669" /> : <span className="text-arcade-muted text-xs">撤退</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// [新機能1] GET確認シート（商品名入力・メルカリ相場・シェア）
// ══════════════════════════════════════════════════════════
function GetConfirmSheet({ totalSpent, machine, onConfirm }) {
  const [priceInput,  setPriceInput]  = useState('');
  const [prizeName,   setPrizeName]   = useState('');
  const [searchQuery, setSearchQuery] = useState(machine?.label ?? '');
  const inputRef = useRef(null);

  const label      = machine?.label ?? '';
  const mercariUrl = `https://jp.mercari.com/search?keyword=${encodeURIComponent(searchQuery.trim() || label)}`;

  const priceVal = parseInt(priceInput, 10) || 0;
  const profit   = priceVal > 0 ? priceVal - totalSpent : null;
  const roiPct   = priceVal > 0 ? Math.round(((priceVal - totalSpent) / totalSpent) * 100) : null;

  const handleShare = () => {
    const name   = prizeName.trim();
    const canvas = buildGetCanvas({
      prizeName:  name,
      totalSpent,
      prizeValue: priceVal,
      roiPct,
      machineName: machine?.label ?? '',
      storeName:   '',
    });

    const tweetText = [
      name ? `「${name}」をGET！🎉` : 'クレゲでGET！🎉',
      priceVal > 0
        ? `投資${formatYen(totalSpent)} / 相場${formatYen(priceVal)} / ROI${roiPct >= 0 ? '+' : ''}${roiPct}%`
        : `投資${formatYen(totalSpent)}`,
      '#クレーンゲーム #クレゲ',
      'crane-analytics.vercel.app',
    ].join('\n');

    const fallbackToX = () => {
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank', 'noopener,noreferrer');
    };

    if (navigator.canShare) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'crane-get.png', { type: 'image/png' });
        try {
          await navigator.share({ files: [file], text: tweetText });
        } catch {
          fallbackToX();
        }
      }, 'image/png');
    } else {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `crane-get-${Date.now()}.png`;
      a.click();
      fallbackToX();
    }
    onConfirm(priceVal, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-slide-up"
         style={{ background: 'rgba(15,23,42,0.45)' }}>
      <div className="rounded-t-3xl p-5 flex flex-col gap-3 bg-arcade-card shadow-bento-lg"
           style={{ border: '1px solid #E2E8F0', borderBottom: 'none', maxHeight: '92dvh', overflowY: 'auto' }}>

        {/* ヘッダー */}
        <div className="text-center pb-3 border-b border-arcade-border">
          <div style={{ fontSize: 44, lineHeight: 1.1 }}>🎉</div>
          <p className="text-green-600 text-2xl font-bold mt-1">GET！</p>
          <p className="font-num text-arcade-amber text-lg font-semibold mt-0.5">
            {formatYen(totalSpent)} で獲得
          </p>
          <p className="text-arcade-muted text-xs mt-0.5">{machine?.labelLong ?? ''}</p>
        </div>

        {/* 商品名入力 */}
        <div>
          <p className="text-arcade-subtext text-xs font-medium mb-1.5">🏷️ 商品名（任意・履歴に表示）</p>
          <input
            type="text"
            placeholder="例：鬼滅の刃 炭治郎 フィギュア"
            value={prizeName}
            onChange={e => setPrizeName(e.target.value)}
            className="w-full bg-arcade-bg border border-arcade-border rounded-2xl
                       px-3 py-2.5 text-arcade-text text-sm outline-none focus:border-amber-400"
          />
        </div>

        {/* メルカリ相場チェック＋入力エリア */}
        <div className="flex flex-col gap-2">

          {/* 商品名入力＋メルカリ検索ボタン */}
          <div>
            <p className="text-arcade-subtext text-xs font-medium mb-1.5">🛒 相場を検索して入力</p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-arcade-bg border border-arcade-border
                              rounded-2xl px-3 py-2 focus-within:border-red-400 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                     className="flex-shrink-0">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="例：炭治郎 フィギュア プライズ"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm text-arcade-text placeholder-arcade-muted
                             bg-transparent outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    className="text-arcade-muted text-xs cursor-pointer flex-shrink-0">✕</button>
                )}
              </div>
              <a href={mercariUrl} target="_blank" rel="noopener noreferrer"
                 className="no-select flex items-center justify-center gap-1 px-3 rounded-2xl cursor-pointer flex-shrink-0"
                 style={{ background: '#FF4B4B', textDecoration: 'none', minWidth: 68 }}>
                <span style={{ fontSize: 13 }}>🛒</span>
                <span className="text-white text-xs font-bold">検索</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                     stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 相場入力フィールド */}
          <div className="flex items-center gap-2 bg-arcade-bg border rounded-2xl px-3 py-2.5 transition-colors"
               style={{ borderColor: priceVal > 0 ? '#FF4B4B' : '#E2E8F0' }}>
            <span className="font-num text-lg text-arcade-subtext">¥</span>
            <input
              ref={inputRef}
              type="number" inputMode="numeric" placeholder="確認した相場（任意）"
              value={priceInput}
              onChange={e => setPriceInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onConfirm(priceVal, prizeName.trim())}
              className="flex-1 font-num text-lg text-arcade-text placeholder-arcade-muted
                         bg-transparent outline-none"
            />
            {priceVal > 0 && (
              <button onClick={() => setPriceInput('')}
                className="text-arcade-muted text-xs cursor-pointer flex-shrink-0">✕</button>
            )}
          </div>

          {/* 損益プレビュー */}
          {profit !== null && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl"
                 style={{
                   background: profit >= 0 ? '#F0FDF4' : '#FFF1F2',
                   border: `1px solid ${profit >= 0 ? '#BBF7D0' : '#FFE4E6'}`,
                 }}>
              <span className="text-xs" style={{ color: profit >= 0 ? '#166534' : '#9F1239' }}>
                {profit >= 0 ? '💰 転売益' : '📉 転売損'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-num font-bold text-sm"
                      style={{ color: profit >= 0 ? '#16a34a' : '#e11d48' }}>
                  {profit >= 0 ? '+' : ''}{formatYen(profit)}
                </span>
                <span className="font-num text-xs px-1.5 py-0.5 rounded-lg"
                      style={{
                        background: profit >= 0 ? '#DCFCE7' : '#FFE4E6',
                        color:      profit >= 0 ? '#166534' : '#9F1239',
                      }}>
                  {roiPct >= 0 ? '+' : ''}{roiPct}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ボタン群 */}
        <div className="flex flex-col gap-2">
          {/* 記録完了ボタン */}
          <button onClick={() => onConfirm(priceVal, prizeName.trim())}
            className="no-select btn-press w-full py-4 rounded-2xl font-bold text-white text-base cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 16px rgba(5,150,105,0.25)' }}>
            {priceVal > 0 ? `相場 ${formatYen(priceVal)} で記録して完了` : '記録して完了'}
          </button>

          {/* Xシェアボタン */}
          <button onClick={handleShare}
            className="no-select btn-press w-full py-3 rounded-2xl font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
            style={{ background: '#000', color: '#fff' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Xでシェアして記録
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// [新機能2] 転売相場入力シート
// ══════════════════════════════════════════════════════════
function MarketValueSheet({ currentValue, machineName, onSet, onClose }) {
  const [input, setInput] = useState(currentValue > 0 ? String(currentValue) : '');
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSet = () => {
    const val = parseInt(input, 10) || 0;
    onSet(val);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-slide-up"
         style={{ background: 'rgba(15,23,42,0.45)' }}
         onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rounded-t-3xl p-5 flex flex-col gap-4 bg-arcade-card shadow-bento-lg"
           style={{ border: '1px solid #E2E8F0', borderBottom: 'none' }}>

        <div>
          <p className="text-arcade-text text-base font-semibold">転売想定額を設定</p>
          <p className="text-arcade-muted text-xs mt-1">
            メルカリ相場を入力 → 投資額が超えた瞬間に「採算割れ」アラートが発動
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-arcade-subtext text-xl font-num">¥</span>
          <input
            ref={inputRef}
            type="number" inputMode="numeric" placeholder="例：3,500"
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSet()}
            className="flex-1 font-num text-xl text-arcade-text placeholder-arcade-muted
                       bg-arcade-bg border border-arcade-border rounded-xl px-3 py-2.5
                       outline-none"
            style={{ borderColor: input ? '#7C3AED' : undefined }}
          />
        </div>

        {/* ヒント */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
             style={{ background: '#7C3AED0A', border: '1px solid #7C3AED20' }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <p className="text-xs text-arcade-subtext">
            「{machineName}」をメルカリで検索して現在の落札相場を確認してから入力
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSet}
            className="no-select flex-1 py-3 rounded-2xl font-bold text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}>
            設定する
          </button>
          <button onClick={onClose}
            className="no-select px-4 py-3 rounded-2xl text-arcade-muted border border-arcade-border cursor-pointer bg-arcade-cardAlt">
            スキップ
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// メインコンポーネント
// ══════════════════════════════════════════════════════════
export default function PlayScreen({ sessions, currentStore, onSessionEnd, onStoreChange, settings = {} }) {
  const playUnitCost      = settings.playUnitCost      ?? 100;
  const probNSys          = settings.probNSys          ?? 30;
  const retreatThreshold  = settings.retreatThreshold  ?? 3000;
  const smallMoveStreak   = settings.smallMoveStreak   ?? 2;
  const roiAlertEnabled   = settings.roiAlertEnabled   ?? true;
  const [phase,           setPhase]        = useState('machine_select');
  const [session,         setSession]      = useState(null);
  const [lastMovement,    setLastMv]       = useState(null);
  const [btnAnim,         setBtnAnim]      = useState(false);
  const [alertShown,      setAlertShown]   = useState(false);
  // 新機能
  const [showGetSheet,    setShowGetSheet] = useState(false);
  const [estimatedValue,  setEstValue]     = useState(0);   // 転売想定額
  const [showMarketInput, setShowMarket]   = useState(false);

  const eta = calcEta(sessions);

  // ── スマホ戻るボタン対応 ─────────────────────────
  useEffect(() => {
    if (phase === 'playing') window.history.pushState({ crane: 'playing' }, '');
  }, [phase]);
  useEffect(() => {
    const handler = () => {
      if (phase === 'playing') {
        setPhase('machine_select');
        setSession(null);
        setShowGetSheet(false);
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [phase]);

  const handleSelectMachine = (machineId, isProbMachine) => {
    setSession(createSession(machineId, isProbMachine, currentStore));
    setLastMv(null);
    setAlertShown(false);
    setShowGetSheet(false);
    setEstValue(0);
    setPhase('playing');
  };

  const handleAddPlay = (movementId) => {
    setLastMv(movementId);
    setBtnAnim(true);
    setTimeout(() => setBtnAnim(false), 200);

    setSession(prev => {
      const newPlays = [...prev.plays, { movement: movementId, amount: playUnitCost }];
      const newSpent = newPlays.length * playUnitCost;
      const alert    = shouldRetreat(newSpent, newPlays, retreatThreshold, smallMoveStreak);
      if (alert && !prev.retreatAlertShown) {
        requestAnimationFrame(() => setAlertShown(true));
      }
      return {
        ...prev,
        plays:             newPlays,
        totalSpent:        newSpent,
        retreatAlertShown: prev.retreatAlertShown || alert,
      };
    });
  };

  // GETボタン → 確認シートを表示
  const handleWin = () => setShowGetSheet(true);

  // 確認シートで「記録して完了」
  const handleConfirmWin = useCallback((prizeValue, prizeName) => {
    setShowGetSheet(false);
    setSession(prev => {
      const finished = {
        ...prev,
        won:        true,
        wonAt:      prev.totalSpent,
        prizeValue: prizeValue > 0 ? prizeValue : null,
        prizeName:  prizeName || null,
      };
      requestAnimationFrame(() => onSessionEnd(finished));
      return finished;
    });
    setEstValue(0);
    setPhase('machine_select');
  }, [onSessionEnd]);

  const handleRetreat = useCallback(() => {
    setShowGetSheet(false);
    setSession(prev => {
      const finished = { ...prev, won: false };
      requestAnimationFrame(() => onSessionEnd(finished));
      return finished;
    });
    setEstValue(0);
    setPhase('machine_select');
  }, [onSessionEnd]);

  // ── 計算値 ──────────────────────────────────────────
  const movementMm   = lastMovement ? (MOVEMENT_LEVELS.find(l => l.id === lastMovement)?.mm ?? 14) : 14;
  const machine      = MACHINE_TYPES.find(m => m.id === session?.machineId);
  const totalSpent   = session?.totalSpent ?? 0;
  const playsCount   = session?.plays.length ?? 0;
  const retreatAlert = session ? shouldRetreat(totalSpent, session.plays, retreatThreshold, smallMoveStreak) : false;
  // 転売採算割れ：想定額が設定されていて、投資額が超過し、かつ損切りアラートがまだ出ていない場合
  const roiAlert = roiAlertEnabled && estimatedValue > 0 && totalSpent >= estimatedValue && !retreatAlert;

  const expected = session ? calcExpected({
    machineId:    session.machineId,
    movementMm,   eta,
    currentPlays: playsCount,
    nSys:         session.isProbMachine ? probNSys : 0,
  }) : null;

  // ══════════════════════════════════════════════════
  if (phase === 'machine_select') {
    return (
      <MachineSelectScreen
        sessions={sessions}
        currentStore={currentStore}
        onSelect={handleSelectMachine}
        onStoreChange={onStoreChange}
      />
    );
  }

  // ══════════════════════════════════════════════════
  // プレイ中画面
  // ══════════════════════════════════════════════════
  const bgColor = retreatAlert ? '#FFF5F5' : roiAlert ? '#FAF5FF' : '#F8FAFC';

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: bgColor }}>

      {/* 店舗バー */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-arcade-border bg-arcade-cardAlt">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
             stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <span className="text-arcade-muted text-xs">{currentStore || '店舗未設定'}</span>
      </div>

      {/* ── [新機能2] 転売採算割れアラート ── */}
      {roiAlert && (
        <div className="mx-3 mt-2 rounded-2xl p-3 flex items-start gap-3 animate-slide-up"
             style={{ background: '#7C3AED', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
          <span style={{ fontSize: 18 }}>🚫</span>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">転売採算割れ</p>
            <p className="text-purple-100 text-xs">
              投資 {formatYen(totalSpent)} ≥ 想定相場 {formatYen(estimatedValue)} —
              これ以上の投資は転売メリットなし
            </p>
          </div>
          <button onClick={handleRetreat}
            className="no-select bg-white/20 text-white text-xs rounded-xl px-2 py-1 cursor-pointer flex-shrink-0">
            撤退
          </button>
        </div>
      )}

      {/* 損切りアラート */}
      {retreatAlert && (
        <div className="mx-3 mt-2 rounded-2xl p-3 flex items-start gap-3 animate-slide-up"
             style={{ background: '#DC2626', boxShadow: '0 0 20px rgba(220,38,38,0.3)' }}>
          <IconWarning size={20} color="#fff" />
          <div className="flex-1">
            <p className="text-white font-bold text-sm">損切り推奨</p>
            <p className="text-red-100 text-xs">{formatYen(retreatThreshold)}超え + 微動{smallMoveStreak}回継続 = 期待値マイナス確定</p>
          </div>
          <button onClick={handleRetreat}
            className="no-select bg-white/20 text-white text-xs rounded-xl px-2 py-1 cursor-pointer">
            撤退
          </button>
        </div>
      )}

      {/* ヘッダー（機種名 + 相場設定 + 撤退） */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <MachineIcon machineId={machine?.icon || session?.machineId} size={16}
            color={machine?.color ?? '#94A3B8'} />
          <div className="min-w-0">
            <span className="text-arcade-text text-sm font-medium">{machine?.labelLong}</span>
            {machine?.D > 0 &&
              <span className="text-arcade-muted text-xs ml-2 font-num">D={machine.D}mm</span>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* [新機能2] 転売相場設定ボタン */}
          <button onClick={() => setShowMarket(true)}
            className="no-select flex items-center gap-1 text-xs rounded-xl px-2.5 py-1 cursor-pointer border transition-colors"
            style={{
              background:   estimatedValue > 0 ? '#7C3AED10' : '#FFFFFF',
              borderColor:  estimatedValue > 0 ? '#7C3AED'   : '#E2E8F0',
              color:        estimatedValue > 0 ? '#7C3AED'   : '#94A3B8',
            }}>
            <span style={{ fontSize: 11 }}>📊</span>
            <span className="font-num">
              {estimatedValue > 0 ? formatYen(estimatedValue) : '相場設定'}
            </span>
          </button>

          {!retreatAlert && (
            <button onClick={handleRetreat}
              className="text-arcade-muted text-xs border border-arcade-border rounded-xl px-2.5 py-1 cursor-pointer bg-arcade-card">
              撤退
            </button>
          )}
        </div>
      </div>

      {/* 累計カウンター */}
      <div className="flex flex-col items-center py-2.5">
        <span className="text-arcade-subtext text-xs mb-0.5">累計投資</span>
        <span className="font-num font-bold text-5xl"
          style={{
            color:      retreatAlert ? '#DC2626' : roiAlert ? '#7C3AED' : totalSpent >= 3000 ? '#DC2626' : '#D97706',
            transform:  btnAnim ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), color 0.3s',
            display:    'block',
          }}>
          {formatYen(totalSpent)}
        </span>

        {/* [新機能2] 想定相場との比較ミニバー */}
        {estimatedValue > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs" style={{ color: roiAlert ? '#DC2626' : '#94A3B8' }}>
              {roiAlert ? '⚠️' : ''}相場 {formatYen(estimatedValue)}
            </span>
            <div className="w-20 h-1.5 bg-arcade-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300"
                   style={{
                     width: `${Math.min(100, (totalSpent / estimatedValue) * 100)}%`,
                     background: roiAlert
                       ? 'linear-gradient(90deg,#DC2626,#EF4444)'
                       : 'linear-gradient(90deg,#7C3AED,#8B5CF6)',
                   }} />
            </div>
            <span className="font-num text-xs"
                  style={{ color: roiAlert ? '#DC2626' : '#7C3AED' }}>
              {Math.round((totalSpent / estimatedValue) * 100)}%
            </span>
          </div>
        )}

        <span className="text-arcade-muted text-xs mt-0.5">
          {playsCount}手
          {!session?.isProbMachine && ` · η=${Math.round(eta * 100)}%`}
        </span>
      </div>

      {/* 期待値バー */}
      {expected && !session.isProbMachine && (
        <div className="mx-3 bg-arcade-card border border-arcade-border rounded-2xl px-3 pt-2 pb-2 mb-1.5 shadow-bento">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-arcade-subtext text-xs">推定残り</span>
            <span className="font-num text-sm font-semibold"
              style={{ color: retreatAlert ? '#DC2626' : '#D97706' }}>
              あと{expected.remaining}手 ≈ {formatYen(expected.remainingCost)}
            </span>
          </div>
          <div className="h-2 bg-arcade-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${expected.progressPct}%`,
                background: retreatAlert
                  ? 'linear-gradient(90deg,#DC2626,#EF4444)'
                  : expected.progressPct > 80
                    ? 'linear-gradient(90deg,#059669,#10b981)'
                    : 'linear-gradient(90deg,#D97706,#F59E0B)',
              }} />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-arcade-muted text-xs">0手</span>
            <span className="text-arcade-muted text-xs font-num">推定{expected.totalExpected}手</span>
          </div>
        </div>
      )}

      {/* 動き評価ボタン / プレイカウンター */}
      {session.isProbMachine ? (
        /* 確率機・フック台：シンプルカウンター */
        <div className="px-3 mb-2">
          <p className="text-arcade-subtext text-xs mb-1.5 text-center">
            プレイを記録（＝+{formatYen(playUnitCost)}）
          </p>
          <button
            onClick={() => handleAddPlay('normal')}
            className="no-select btn-press w-full flex flex-col items-center justify-center
                       rounded-2xl cursor-pointer transition-all duration-150"
            style={{
              minHeight: '100px',
              background: btnAnim ? `${machine?.color ?? '#0891b2'}12` : '#FFFFFF',
              border:     `2px solid ${btnAnim ? (machine?.color ?? '#0891b2') : '#E2E8F0'}`,
              boxShadow:  btnAnim ? `0 0 16px ${machine?.color ?? '#0891b2'}33` : '0 1px 3px rgba(0,0,0,0.05)',
            }}>
            <span className="font-num font-bold text-5xl" style={{ color: machine?.color ?? '#0891b2' }}>
              {playsCount}
            </span>
            <span className="text-sm font-semibold mt-1" style={{ color: machine?.color ?? '#0891b2' }}>
              回プレイ
            </span>
            <span className="text-arcade-muted text-xs mt-0.5">タップで +1</span>
          </button>
        </div>
      ) : (
        /* 通常機種：動き評価ボタン */
        <div className="px-3 mb-2">
          <p className="text-arcade-subtext text-xs mb-1.5 text-center">動きを記録（＝+{formatYen(playUnitCost)}）</p>
          <div className="grid grid-cols-3 gap-2">
            {MOVEMENT_LEVELS.map(lv => {
              const isActive = lastMovement === lv.id;
              return (
                <button key={lv.id} onClick={() => handleAddPlay(lv.id)}
                  className="no-select btn-press flex flex-col items-center justify-center
                             rounded-2xl cursor-pointer transition-all duration-150"
                  style={{
                    minHeight: '80px',
                    background: isActive ? `${lv.color}12` : '#FFFFFF',
                    border:     `2px solid ${isActive ? lv.color : '#E2E8F0'}`,
                    boxShadow:  isActive ? `0 0 12px ${lv.color}33` : '0 1px 3px rgba(0,0,0,0.05)',
                  }}>
                  <span className="font-num font-bold text-2xl" style={{ color: lv.color }}>{lv.mm}</span>
                  <span className="text-sm font-semibold mt-0.5" style={{ color: lv.color }}>{lv.label}</span>
                  <span className="text-arcade-muted text-xs">{lv.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 獲得ボタン */}
      <div className="px-3 mt-auto mb-3">
        <button onClick={handleWin}
          className="no-select btn-press w-full py-4 rounded-2xl font-bold text-lg text-white cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
          獲得！ GET
        </button>
      </div>

      {/* [新機能1] GET確認シート（メルカリリンク付き） */}
      {showGetSheet && (
        <GetConfirmSheet
          totalSpent={totalSpent}
          machine={machine}
          onConfirm={handleConfirmWin}
        />
      )}

      {/* [新機能2] 転売相場入力シート */}
      {showMarketInput && (
        <MarketValueSheet
          currentValue={estimatedValue}
          machineName={machine?.label ?? ''}
          onSet={setEstValue}
          onClose={() => setShowMarket(false)}
        />
      )}
    </div>
  );
}
