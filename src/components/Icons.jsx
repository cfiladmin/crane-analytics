// SVG アイコンコンポーネント集
export function IconClaw3({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="10" />
      <path d="M8 10 Q6 14 5 18" />
      <path d="M12 10 Q12 15 12 18" />
      <path d="M16 10 Q18 14 19 18" />
      <circle cx="5" cy="19" r="1.5" fill={color} stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill={color} stroke="none" />
      <circle cx="19" cy="19" r="1.5" fill={color} stroke="none" />
      <rect x="9" y="9" width="6" height="3" rx="1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconBridge({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <line x1="3"  y1="12" x2="21" y2="12" />
      <line x1="3"  y1="8"  x2="3"  y2="20" />
      <line x1="21" y1="8"  x2="21" y2="20" />
      <circle cx="12" cy="9" r="3" fill="none" />
      <path d="M9 12 Q9 18 12 18 Q15 18 15 12" fill={color} opacity="0.35" stroke="none" />
    </svg>
  );
}

export function IconValley({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 6 L10 16 L12 14 L14 16 L21 6" />
      <circle cx="12" cy="17" r="2" fill={color} stroke="none" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  );
}

export function IconClaw1({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="14" />
      <path d="M9 14 Q7 17 8 21" />
      <path d="M15 14 Q17 17 16 21" />
      <rect x="10" y="12" width="4" height="4" rx="1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconProb({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8"  cy="8"  r="1.5" fill={color} stroke="none" />
      <circle cx="16" cy="8"  r="1.5" fill={color} stroke="none" />
      <circle cx="8"  cy="16" r="1.5" fill={color} stroke="none" />
      <circle cx="16" cy="16" r="1.5" fill={color} stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

export function IconHook({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* アーム（横棒） */}
      <line x1="4" y1="4" x2="14" y2="4" />
      {/* ワイヤー（縦） */}
      <line x1="14" y1="4" x2="14" y2="10" />
      {/* フック本体（J字形） */}
      <path d="M11 10 Q8 10 8 13 Q8 17 12 17 Q16 17 16 13" />
      {/* フック先端の小さな返し */}
      <line x1="16" y1="13" x2="18" y2="11" />
    </svg>
  );
}

export function IconOther({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9 Q12 6 15 9 Q18 12 12 15" />
      <circle cx="12" cy="19" r="1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconPlay({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

export function IconChart({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  );
}

export function IconHistory({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

export function IconTrophy({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

export function IconWarning({ size = 16, color = '#ef4444' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function IconCheck({ size = 16, color = '#10b981' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

export function IconSettings({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// 機種IDまたはアイコン文字列からアイコンを返すヘルパー
export function MachineIcon({ machineId, size = 28, color }) {
  const map = {
    // ID ベース
    three_claw:    IconClaw3,
    bridge:        IconBridge,
    bridge_std:    IconBridge,
    bridge_wide:   IconBridge,
    bridge_narrow: IconBridge,
    valley:        IconValley,
    front_drop:    IconValley,
    one_claw:      IconClaw1,
    prob:          IconProb,
    hook:          IconHook,
    other:         IconOther,
    // icon文字列ベース（MACHINE_TYPESのiconフィールド）
    claw3:  IconClaw3,
    claw1:  IconClaw1,
  };
  const Comp = map[machineId] || IconOther;
  return <Comp size={size} color={color} />;
}
