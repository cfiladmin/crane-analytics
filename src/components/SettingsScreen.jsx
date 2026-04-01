import { useState } from 'react';
import { DEFAULT_SETTINGS, saveSettings, formatYen } from '../utils/analytics';
import { IconWarning } from './Icons';

// ── 汎用コンポーネント ────────────────────────────────────

function Section({ title, icon, children }) {
  return (
    <div className="bg-arcade-card border border-arcade-border rounded-2xl overflow-hidden shadow-bento">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-arcade-border bg-arcade-cardAlt">
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span className="text-arcade-text text-sm font-semibold">{title}</span>
      </div>
      <div className="divide-y divide-arcade-border">
        {children}
      </div>
    </div>
  );
}

function RowStepInput({ label, sub, value, onChange, min, max, step, unit, presets }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-arcade-text text-sm font-medium">{label}</p>
          {sub && <p className="text-arcade-muted text-xs mt-0.5">{sub}</p>}
        </div>
        <span className="font-num font-bold text-sm text-arcade-text ml-4 flex-shrink-0">
          {unit === '¥' ? formatYen(value) : `${value}${unit}`}
        </span>
      </div>

      {/* スライダー */}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: '#D97706' }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-arcade-muted text-xs font-num">
          {unit === '¥' ? formatYen(min) : `${min}${unit}`}
        </span>
        <span className="text-arcade-muted text-xs font-num">
          {unit === '¥' ? formatYen(max) : `${max}${unit}`}
        </span>
      </div>

      {/* プリセットチップ */}
      {presets && (
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {presets.map(p => (
            <button
              key={p.value}
              onClick={() => onChange(p.value)}
              className="no-select text-xs px-2.5 py-1 rounded-lg cursor-pointer border transition-colors"
              style={{
                background:  value === p.value ? '#D9770618' : '#FFFFFF',
                borderColor: value === p.value ? '#D97706'   : '#E2E8F0',
                color:       value === p.value ? '#D97706'   : '#94A3B8',
              }}>
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RowToggle({ label, sub, value, onChange, onColor = '#059669' }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-arcade-text text-sm font-medium">{label}</p>
        {sub && <p className="text-arcade-muted text-xs mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="no-select flex-shrink-0 relative cursor-pointer transition-colors duration-200"
        style={{ width: 48, height: 28 }}
        aria-label={label}
      >
        <div className="absolute inset-0 rounded-full transition-colors duration-200"
             style={{ background: value ? onColor : '#CBD5E1' }} />
        <div className="absolute top-1 transition-all duration-200 rounded-full bg-white shadow-sm"
             style={{
               width: 20, height: 20,
               left: value ? 'calc(100% - 24px)' : 4,
             }} />
      </button>
    </div>
  );
}

function RowSelect({ label, sub, value, onChange, options }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-arcade-text text-sm font-medium">{label}</p>
          {sub && <p className="text-arcade-muted text-xs mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="no-select text-xs px-3 py-1.5 rounded-xl cursor-pointer border font-num transition-colors"
            style={{
              background:  value === opt.value ? '#2563EB18' : '#FFFFFF',
              borderColor: value === opt.value ? '#2563EB'   : '#E2E8F0',
              color:       value === opt.value ? '#2563EB'   : '#475569',
              fontWeight:  value === opt.value ? 700 : 400,
            }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── メイン ───────────────────────────────────────────────
export default function SettingsScreen({ settings, onSave }) {
  const [local, setLocal] = useState({ ...settings });
  const [saved,  setSaved] = useState(false);

  const update = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    saveSettings(local);
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocal({ ...DEFAULT_SETTINGS });
  };

  const isDirty = JSON.stringify(local) !== JSON.stringify(settings);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-arcade-bg animate-fade-in">

      {/* ヘッダー */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
        <h2 className="text-arcade-text text-base font-semibold">フック設定</h2>
        <button
          onClick={handleReset}
          className="text-arcade-muted text-xs border border-arcade-border rounded-xl px-3 py-1 cursor-pointer bg-arcade-card">
          デフォルトに戻す
        </button>
      </div>

      <div className="px-4 flex flex-col gap-3 pb-6">

        {/* ── 損切りフック ── */}
        <Section title="損切りフック" icon="🔴">
          <RowStepInput
            label="損切り判定額"
            sub="投資がこの金額を超えると判定を開始"
            value={local.retreatThreshold}
            onChange={v => update('retreatThreshold', v)}
            min={1000} max={10000} step={500} unit="¥"
            presets={[
              { value: 1000, label: '¥1,000' },
              { value: 2000, label: '¥2,000' },
              { value: 3000, label: '¥3,000（標準）' },
              { value: 5000, label: '¥5,000' },
            ]}
          />
          <RowSelect
            label="連続微動の回数"
            sub="この回数連続で「微動（6mm）」が続くと撤退推奨アラートを発動"
            value={local.smallMoveStreak}
            onChange={v => update('smallMoveStreak', v)}
            options={[
              { value: 1, label: '1回連続' },
              { value: 2, label: '2回連続（標準）' },
              { value: 3, label: '3回連続' },
              { value: 4, label: '4回連続' },
            ]}
          />
        </Section>

        {/* ── 転売採算フック ── */}
        <Section title="転売採算フック" icon="🚫">
          <RowToggle
            label="転売採算割れアラート"
            sub="投資額が転売想定額を超えた時に紫色のアラートを表示"
            value={local.roiAlertEnabled}
            onChange={v => update('roiAlertEnabled', v)}
            onColor="#7C3AED"
          />
        </Section>

        {/* ── プレイ設定 ── */}
        <Section title="プレイ基本設定" icon="🎮">
          <RowSelect
            label="1プレイあたりの金額"
            sub="「動きを記録」ボタン1回ごとに加算される金額"
            value={local.playUnitCost}
            onChange={v => update('playUnitCost', v)}
            options={[
              { value: 50,  label: '¥50' },
              { value: 100, label: '¥100（標準）' },
              { value: 200, label: '¥200' },
            ]}
          />
          <RowStepInput
            label="確率機の天井（N_sys）"
            sub="ぬいぐるみ確率機の保証手数。カウンター設定が不明な場合のデフォルト値"
            value={local.probNSys}
            onChange={v => update('probNSys', v)}
            min={10} max={80} step={5} unit="手"
            presets={[
              { value: 15, label: '15手' },
              { value: 20, label: '20手' },
              { value: 30, label: '30手（標準）' },
              { value: 50, label: '50手' },
            ]}
          />
        </Section>

        {/* 現在の設定サマリー */}
        <div className="bg-arcade-cardAlt border border-arcade-border rounded-2xl p-4">
          <p className="text-arcade-text text-xs font-semibold mb-3">現在の設定サマリー</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '損切り判定額',   val: formatYen(local.retreatThreshold) },
              { label: '連続微動回数',   val: `${local.smallMoveStreak}回` },
              { label: '1プレイ金額',   val: formatYen(local.playUnitCost) },
              { label: '確率機天井',    val: `${local.probNSys}手` },
              { label: '転売アラート',  val: local.roiAlertEnabled ? 'ON' : 'OFF' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-arcade-muted text-xs">{item.label}</span>
                <span className="font-num text-arcade-text text-xs font-semibold">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 損切りフックの説明 */}
        <div className="px-3 py-3 rounded-2xl"
             style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div className="flex items-start gap-2">
            <IconWarning size={14} color="#DC2626" />
            <div>
              <p className="text-red-600 text-xs font-semibold mb-1">損切りアルゴリズムの仕組み</p>
              <p className="text-arcade-muted text-xs leading-relaxed">
                「累計投資 ≥ 判定額」かつ「直近{local.smallMoveStreak}回が連続微動（6mm以下）」の条件を
                <span className="font-semibold text-red-600">同時に満たした瞬間</span>に発動。
                どちらか一方だけでは発動しません。
              </p>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          disabled={!isDirty && !saved}
          className="no-select btn-press w-full py-4 rounded-2xl font-bold text-base cursor-pointer transition-all"
          style={{
            background: saved
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : isDirty
                ? 'linear-gradient(135deg, #D97706, #F59E0B)'
                : '#E2E8F0',
            color:   saved || isDirty ? '#FFFFFF' : '#94A3B8',
            boxShadow: isDirty ? '0 4px 16px rgba(217,119,6,0.25)' : 'none',
          }}>
          {saved ? '✓ 保存しました' : isDirty ? '設定を保存' : '変更なし'}
        </button>

      </div>
    </div>
  );
}
