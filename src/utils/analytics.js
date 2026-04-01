/**
 * クレーンゲーム期待値数理モデル
 * E[N] = D / (m * η) + N_sys
 *
 * D     = 景品の落下までの累積移動距離 (mm) — 景品サイズ・機種から設定
 * m     = 1手あたりの変位量 (mm) — プレイヤーの評価から割り当て
 * η     = 技術習得係数 (0〜1.3) — 過去の獲得セッションから逆算
 * N_sys = ぬいぐるみ（確率機）の保証手数
 */

// ── 機種定義 ─────────────────────────────────────────────
// 橋渡し5種 + 前落とし + ぬいぐるみ（確率機）+ その他
export const MACHINE_TYPES = [
  // ── 橋渡し ────────────────────────────────────────────
  {
    id:           'bridge_small_box',
    label:        '小箱',
    labelLong:    '橋渡し・小箱',
    category:     'bridge',
    icon:         'bridge',
    D:            150,
    color:        '#22c55e',
    isProbDefault: false,
    prizeHint:    'お菓子・キーホルダー・小型雑貨',
    physicsNote:  '軽量で1手の動きが大きい。最短手数が少ない',
  },
  {
    id:           'bridge_fig_s',
    label:        'フィギュア（小）',
    labelLong:    '橋渡し・フィギュア（小）',
    category:     'bridge',
    icon:         'bridge',
    D:            180,
    color:        '#3b82f6',
    isProbDefault: false,
    prizeHint:    'Q posket・ぬーどるストッパー',
    physicsNote:  '重心が安定した立方体に近い形状',
  },
  {
    id:           'bridge_fig_m',
    label:        'フィギュア（中）',
    labelLong:    '橋渡し・フィギュア（中）',
    category:     'bridge',
    icon:         'bridge',
    D:            210,      // PDFデータ基準値: 14手 × 15mm ≈ 210mm
    color:        '#f59e0b',
    isProbDefault: false,
    prizeHint:    '通常のプライズフィギュア（標準）',
    physicsNote:  'PDFデータの基準値。D=210mm',
  },
  {
    id:           'bridge_fig_l',
    label:        'フィギュア（大）',
    labelLong:    '橋渡し・フィギュア（大）',
    category:     'bridge',
    icon:         'bridge',
    D:            270,
    color:        '#f97316',
    isProbDefault: false,
    prizeHint:    '1/7スケール・厚箱・重量物',
    physicsNote:  '重量と摩擦でD値が増大。長期戦を想定',
  },
  {
    id:           'bridge_fig_long',
    label:        'フィギュア（長箱）',
    labelLong:    '橋渡し・フィギュア（長箱）',
    category:     'bridge',
    icon:         'bridge',
    D:            240,
    color:        '#8b5cf6',
    isProbDefault: false,
    prizeHint:    '刀剣・ロングポスター・縦長箱',
    physicsNote:  '縦ハメ/横ハメの向き判断が勝負を分ける',
  },
  // ── 前落とし ─────────────────────────────────────────
  {
    id:           'front_drop',
    label:        '前落とし',
    labelLong:    '前落とし',
    category:     'front',
    icon:         'valley',
    D:            259,      // PDFデータ: 14手 × 18.5mm ≈ 259mm
    color:        '#06b6d4',
    isProbDefault: false,
    prizeHint:    'フィギュア全般・中型景品',
    physicsNote:  '景品を前の落下口に向けて押し出す',
  },
  // ── ぬいぐるみ（確率機） ─────────────────────────────
  {
    id:           'prob_plush',
    label:        'ぬいぐるみ',
    labelLong:    'ぬいぐるみ（確率機）',
    category:     'prob',
    icon:         'prob',
    D:            0,
    color:        '#ef4444',
    isProbDefault: true,
    prizeHint:    '三本爪・ぬいぐるみ全般',
    physicsNote:  '物理移動でなくN_sys（天井）が支配的',
  },
  // ── フック ───────────────────────────────────────────
  {
    id:           'hook',
    label:        'フック',
    labelLong:    'フック台',
    category:     'hook',
    icon:         'hook',
    D:            0,
    color:        '#0891b2',
    isProbDefault: true,
    prizeHint:    'フック型・1本爪・引っ掛け系',
    physicsNote:  '成否の二択。プレイ回数で管理',
  },
  // ── その他 ───────────────────────────────────────────
  {
    id:           'other',
    label:        'その他',
    labelLong:    'その他',
    category:     'other',
    icon:         'other',
    D:            220,
    color:        '#6b7280',
    isProbDefault: false,
    prizeHint:    '上記に当てはまらない機種',
    physicsNote:  '',
  },
];

// ── カテゴリ定義（UIグルーピング用） ────────────────────
export const MACHINE_CATEGORIES = [
  {
    id:    'bridge',
    label: '橋渡し',
    color: '#3b82f6',
    // 橋幅の身近な判断基準
    widthGuide: [
      { icon: '✊', label: '広設定',  desc: 'こぶしがすっぽり入る ≈ 8〜10cm' },
      { icon: '🖐',  label: '標準設定', desc: '指4〜5本分の隙間 ≈ 6〜8cm'    },
      { icon: '🤞', label: '狭設定',  desc: '指2〜3本がギリギリ ≈ 3〜5cm'    },
    ],
  },
  { id: 'front', label: '前落とし', color: '#06b6d4' },
  { id: 'prob',  label: 'ぬいぐるみ', color: '#ef4444' },
  { id: 'other', label: 'その他',   color: '#6b7280' },
];

// ── 動き評価 → 変位量 (mm) ──────────────────────────────
export const MOVEMENT_LEVELS = [
  { id: 'great',  label: '神動', mm: 22, color: '#3b82f6', desc: '22mm / 広設定' },
  { id: 'normal', label: '標準', mm: 14, color: '#10b981', desc: '14mm / 通常'   },
  { id: 'small',  label: '微動', mm: 6,  color: '#eab308', desc: '6mm / 要注意'  },
];

// ── 期待値計算 ────────────────────────────────────────────
export function calcExpected({ machineId, movementMm, eta = 0.8, currentPlays = 0, nSys = 0 }) {
  const machine = MACHINE_TYPES.find(m => m.id === machineId);
  if (!machine) return { totalExpected: 0, remaining: 0, remainingCost: 0, progressPct: 0 };

  let totalExpected;
  if (machine.isProbDefault) {
    totalExpected = nSys > 0 ? nSys : 30;
  } else {
    const D = machine.D;
    const m = movementMm;
    totalExpected = (m > 0 && eta > 0)
      ? Math.ceil(D / (m * eta)) + nSys
      : 99;
  }

  const remaining     = Math.max(0, totalExpected - currentPlays);
  const remainingCost = remaining * 100;
  const progressPct   = Math.min(100, Math.round((currentPlays / Math.max(1, totalExpected)) * 100));
  return { totalExpected, remaining, remainingCost, progressPct };
}

// ── 技術係数 η 逆算 ──────────────────────────────────────
export function calcEta(sessions) {
  const won = sessions.filter(s => s.won && !s.isProbMachine && s.plays.length > 0);
  if (won.length === 0) return 0.8;
  let sumTheo = 0, sumActual = 0;
  won.forEach(s => {
    const m = MACHINE_TYPES.find(m => m.id === s.machineId);
    if (!m || m.D === 0) return;
    const avgMm = s.plays.reduce((a, p) => {
      const lv = MOVEMENT_LEVELS.find(l => l.id === p.movement);
      return a + (lv ? lv.mm : 14);
    }, 0) / s.plays.length;
    sumTheo   += avgMm > 0 ? Math.ceil(m.D / avgMm) : s.plays.length;
    sumActual += s.plays.length;
  });
  return Math.min(1.3, Math.max(0.3, sumActual > 0 ? sumTheo / sumActual : 0.8));
}

// ── 損切りアラート ────────────────────────────────────────
export function shouldRetreat(totalSpent, plays, threshold = 3000, streak = 2) {
  if (totalSpent < threshold || plays.length < streak) return false;
  return plays.slice(-streak).every(p => {
    const lv = MOVEMENT_LEVELS.find(l => l.id === p.movement);
    return lv ? lv.mm <= 6 : false;
  });
}

// ── 設定 ─────────────────────────────────────────────────
const SETTINGS_KEY = 'crane_settings_v1';

export const DEFAULT_SETTINGS = {
  retreatThreshold: 3000,   // 損切り判定額 (¥)
  smallMoveStreak:  2,      // 連続微動の回数
  playUnitCost:     100,    // 1プレイあたりの金額 (¥)
  probNSys:         30,     // 確率機の天井 (手)
  roiAlertEnabled:  true,   // 転売採算割れアラート
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}
export function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// ── ストレージ ────────────────────────────────────────────
const SESSIONS_KEY = 'crane_sessions_v2';
const STORE_KEY    = 'crane_current_store';
const STORES_KEY   = 'crane_stores_v1';

export function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    let sessions;
    if (!raw) {
      const old = localStorage.getItem('crane_sessions_v1');
      sessions = old ? JSON.parse(old) : [];
    } else {
      sessions = JSON.parse(raw);
    }
    // IDの重複を除去（過去バグで重複保存されたデータのクリーンアップ）
    const seen = new Set();
    const deduped = sessions.filter(s => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
    // 重複があれば上書き保存
    if (deduped.length !== sessions.length) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(deduped));
    }
    return deduped;
  } catch { return []; }
}
export function saveSessions(s) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(s));
}

export function loadCurrentStore() {
  return localStorage.getItem(STORE_KEY) || '';
}
export function saveCurrentStore(name) {
  localStorage.setItem(STORE_KEY, name);
  // 店舗リストにも追加
  const list = loadStoreList();
  if (name && !list.includes(name)) {
    saveStoreList([...list, name]);
  }
}
export function loadStoreList() {
  try { return JSON.parse(localStorage.getItem(STORES_KEY) || '[]'); }
  catch { return []; }
}
export function saveStoreList(list) {
  localStorage.setItem(STORES_KEY, JSON.stringify(list));
}

export function createSession(machineId, isProbMachine, storeName = '') {
  return {
    id:                crypto.randomUUID(),
    date:              new Date().toISOString(),
    machineId,
    isProbMachine,
    storeName,
    plays:             [],
    totalSpent:        0,
    won:               false,
    wonAt:             null,
    prizeValue:        null,
    retreatAlertShown: false,
  };
}

// ── 集計 ─────────────────────────────────────────────────
export function calcStats(sessions) {
  if (!sessions.length) return {
    totalSpent: 0, totalWins: 0, avgCostPerWin: 0, winRate: 0,
    swampCount: 0, retreatSuccessCount: 0, retreatSuccessRate: 0,
    totalPrizeValue: 0, totalROI: 0, alertSessions: 0,
  };
  const totalSpent       = sessions.reduce((a, s) => a + s.totalSpent, 0);
  const totalWins        = sessions.filter(s => s.won).length;
  const winRate          = Math.round((totalWins / sessions.length) * 100);
  const wonCosts         = sessions.filter(s => s.won).map(s => s.totalSpent);
  const avgCostPerWin    = wonCosts.length
    ? Math.round(wonCosts.reduce((a,v)=>a+v,0)/wonCosts.length) : 0;
  const swampCount       = sessions.filter(s => s.totalSpent >= 3000 && !s.won).length;
  const alertSessions    = sessions.filter(s => s.retreatAlertShown).length;
  const retreatSuccessCount = sessions.filter(s => s.retreatAlertShown && !s.won).length;
  const retreatSuccessRate  = alertSessions
    ? Math.round((retreatSuccessCount / alertSessions) * 100) : 0;
  const roiSessions      = sessions.filter(s => s.won && s.prizeValue > 0);
  const totalPrizeValue  = roiSessions.reduce((a,s)=>a+s.prizeValue,0);
  const totalInvested    = roiSessions.reduce((a,s)=>a+s.totalSpent,0);
  const totalROI         = totalInvested
    ? Math.round(((totalPrizeValue-totalInvested)/totalInvested)*100) : 0;
  return {
    totalSpent, totalWins, avgCostPerWin, winRate, swampCount,
    retreatSuccessCount, retreatSuccessRate,
    totalPrizeValue, totalROI, alertSessions,
  };
}

// ── 店舗別集計 ────────────────────────────────────────────
export function calcStoreStats(sessions) {
  const stores = {};
  sessions.forEach(s => {
    const key = s.storeName || '（未設定）';
    if (!stores[key]) stores[key] = { name: key, sessions: [], spent: 0, wins: 0 };
    stores[key].sessions.push(s);
    stores[key].spent += s.totalSpent;
    if (s.won) stores[key].wins++;
  });
  return Object.values(stores).sort((a,b) => b.spent - a.spent);
}

export function formatYen(n) {
  return `¥${Math.abs(n).toLocaleString()}`;
}
