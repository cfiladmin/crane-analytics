import { useState } from 'react';

/* ── アイコン ─────────────────────────────── */
const IconAlert = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconTrending = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
    <polyline points="17,6 23,6 23,12"/>
  </svg>
);
const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

/* ── アプリのモックプレビュー ─────────────────── */
function AppPreview() {
  return (
    <div
      className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border border-amber-200"
      style={{
        width: '100%',
        maxWidth: 320,
        background: '#F8FAFC',
        fontFamily: 'inherit',
      }}
    >
      {/* ステータスバー風 */}
      <div className="h-6 flex items-center px-4 justify-between"
           style={{ background: '#F8FAFC' }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>クレーンAna</span>
        <div className="flex gap-1">
          {[1,2,3].map(i => (
            <div key={i} className="w-1 rounded-full"
                 style={{ height: 6 + i * 2, background: i <= 2 ? '#f59e0b' : '#e2e8f0' }} />
          ))}
        </div>
      </div>

      {/* ヘッダー */}
      <div className="px-4 pb-2 pt-1 border-b"
           style={{ borderColor: '#e2e8f0', background: '#F8FAFC' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
            クレーン<span style={{ color: '#f59e0b' }}>Ana</span>
          </span>
          <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>3件記録済み</span>
        </div>
      </div>

      {/* 投資サマリー */}
      <div className="px-3 pt-3 pb-2">
        <div className="rounded-2xl p-3 mb-2"
             style={{ background: 'linear-gradient(135deg, #f59e0b15, #d9770608)', border: '1px solid #f59e0b30' }}>
          <div className="flex justify-between items-start">
            <div>
              <div style={{ fontSize: 10, color: '#d97706', fontWeight: 600, marginBottom: 2 }}>今日の投資</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>¥1,800</div>
            </div>
            <div className="text-right">
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>期待値ROI</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>+24%</div>
            </div>
          </div>
        </div>

        {/* 損切りアラート */}
        <div className="rounded-xl px-3 py-2 flex items-center gap-2"
             style={{ background: '#fef9c3', border: '1px solid #fde047' }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#854d0e' }}>損切りライン接近</div>
            <div style={{ fontSize: 10, color: '#78350f' }}>橋渡し機　あと¥200で撤退推奨</div>
          </div>
        </div>
      </div>

      {/* 機種リスト */}
      <div className="px-3 pb-3">
        <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6 }}>プレイ中の機種</div>
        {[
          { name: '橋渡し機', spent: '¥1,200', move: '右寄り', color: '#3b82f6' },
          { name: 'プッシャー機', spent: '¥600', move: 'ランダム', color: '#8b5cf6' },
        ].map(item => (
          <div key={item.name}
               className="flex items-center gap-2 rounded-xl px-3 py-2 mb-1.5"
               style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                 style={{ background: item.color + '20' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{item.move}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{item.spent}</div>
          </div>
        ))}
      </div>

      {/* ボトムナビ */}
      <div className="flex border-t" style={{ borderColor: '#e2e8f0', background: '#fff' }}>
        {['プレイ', 'ダッシュ', '履歴', '設定'].map((label, i) => (
          <div key={label}
               className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
               style={{ opacity: i === 0 ? 1 : 0.4 }}>
            <div className="w-3.5 h-3.5 rounded" style={{ background: i === 0 ? '#f59e0b' : '#cbd5e1' }} />
            <span style={{ fontSize: 9, color: i === 0 ? '#f59e0b' : '#94a3b8', fontWeight: i === 0 ? 700 : 400 }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 機能カード ─────────────────────────────── */
function FeatureCard({ icon: Icon, color, title, desc, badge }) {
  return (
    <div className="rounded-2xl p-4 flex gap-3 items-start"
         style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: color + '15', color }}>
        <Icon />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{title}</span>
          {badge && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: color + '15', color, fontSize: 10 }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── メインコンポーネント ────────────────────── */
const trackEvent = (name, params = {}) => {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
};

export default function LandingPage({ onStart }) {
  const [showMore, setShowMore] = useState(false);

  const handleStart = (position) => {
    trackEvent('lp_cta_click', { position }); // どのCTAボタンか
    onStart();
  };

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{ height: '100dvh', background: '#F8FAFC' }}
    >
      {/* ── ヒーローセクション ── */}
      <section
        className="px-5 pt-10 pb-6 text-center flex flex-col items-center"
        style={{ background: 'linear-gradient(180deg, #fffbeb 0%, #F8FAFC 100%)' }}
      >
        {/* バッジ */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold"
             style={{ background: '#f59e0b20', color: '#d97706', border: '1px solid #f59e0b40' }}>
          <span>✨</span>
          <span>完全無料　Googleログインのみ</span>
        </div>

        {/* キャッチコピー */}
        <h1 style={{
          fontSize: 26,
          fontWeight: 900,
          color: '#0f172a',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          marginBottom: 12,
        }}>
          クレゲに<br />
          <span style={{ color: '#f59e0b' }}>使いすぎてない？</span>
        </h1>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 20, maxWidth: 280 }}>
          投資額・期待値をリアルタイム計算。<br />
          損切りラインを超えたら即アラート。
        </p>

        {/* CTA ボタン */}
        <button
          onClick={() => handleStart('hero')}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl font-bold text-sm cursor-pointer
                     active:scale-95 transition-transform"
          style={{
            maxWidth: 320,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
            fontSize: 15,
          }}
        >
          <IconGoogle />
          Googleで無料スタート
        </button>

        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 10 }}>
          メール送信・投稿は一切なし。ログインはデータ保存のためだけ。
        </p>
      </section>

      {/* ── アプリプレビュー ── */}
      <section className="px-5 pb-6">
        <AppPreview />
      </section>

      {/* ── 機能3点 ── */}
      <section className="px-5 pb-6">
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14, textAlign: 'center' }}>
          クレゲの「惰性プレイ」を止める3つの機能
        </h2>
        <div className="flex flex-col gap-3">
          <FeatureCard
            icon={IconAlert}
            color="#ef4444"
            title="損切りアラート"
            badge="最重要"
            desc="投資額・微動回数が設定値を超えたら即通知。「あと少し」の沼から守ります。"
          />
          <FeatureCard
            icon={IconTrending}
            color="#f59e0b"
            title="ROI・期待値計算"
            desc="GET後にメルカリ相場を入力するだけ。自動でROIと損益を計算。"
          />
          <FeatureCard
            icon={IconTarget}
            color="#8b5cf6"
            title="技術熟練度η（イータ）"
            desc="プレイデータから自分の腕前スコアを数値化。成長が見えるとやる気が変わる。"
          />
        </div>
      </section>

      {/* ── 作者ストーリー ── */}
      <section className="px-5 pb-6">
        <div className="rounded-2xl p-5"
             style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fde68a' }}>

          {/* ヘッダー */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                 style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}>
              🎮
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>作った人の話</div>
              <div style={{ fontSize: 11, color: '#92400e' }}>クレゲで1.5万溶かした本人です</div>
            </div>
          </div>

          {/* ストーリー */}
          <div className="flex flex-col gap-3">
            <p style={{ fontSize: 13, color: '#44403c', lineHeight: 1.8 }}>
              「あと少しで取れる」<br />
              その言葉を信じて、気づいたら
              <strong style={{ color: '#b45309' }}> 1回のゲーセンで1.5万円</strong>
              消えていました。
            </p>
            <p style={{ fontSize: 13, color: '#44403c', lineHeight: 1.8 }}>
              感情のまま続けると、いつも同じ後悔をする。<br />
              だから<strong style={{ color: '#0f172a' }}>「やめる基準を数字で決める」</strong>アプリを
              自分のために作りました。
            </p>
            <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                 style={{ background: '#fff', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: 22 }}>📉→📈</span>
              <p style={{ fontSize: 12, color: '#44403c', lineHeight: 1.6 }}>
                使い始めてから、クレゲの月の出費が
                <strong style={{ color: '#16a34a' }}> ほぼ半分</strong>になりました。<br />
                <span style={{ color: '#78350f' }}>同じ思いをしてほしくないので、無料で公開しています。</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 信頼・安心セクション ── */}
      <section className="px-5 pb-6">
        <div className="rounded-2xl p-4"
             style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
            安心して使えます
          </p>
          {[
            'Googleアカウントのメール・投稿に一切アクセスしません',
            'データはあなただけが見られます（Firestore認証済み）',
            '広告なし・課金なし・永久無料',
            'タップ1回で記録。計算は全部自動',
          ].map(item => (
            <div key={item} className="flex items-start gap-2 mb-2 last:mb-0">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                   style={{ background: '#16a34a20', color: '#16a34a' }}>
                <IconCheck />
              </div>
              <span style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 使い方ステップ ── */}
      <section className="px-5 pb-6">
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14, textAlign: 'center' }}>
          使い方は3ステップ
        </h2>
        <div className="relative">
          <div className="absolute left-5 top-6 bottom-6 w-0.5"
               style={{ background: '#e2e8f0', zIndex: 0 }} />
          {[
            { step: '1', title: 'Googleでログイン', desc: 'ワンタップで完了。メアドすら入力不要。', emoji: '🔑' },
            { step: '2', title: '機種を選んで記録', desc: 'プレイするたびにタップで記録。動きも選ぶだけ。', emoji: '🕹️' },
            { step: '3', title: 'アラートで損切り判断', desc: '投資が積み上がると即アラート。メルカリと比較してROI確認。', emoji: '📊' },
          ].map(({ step, title, desc, emoji }) => (
            <div key={step} className="relative flex gap-4 mb-5 last:mb-0" style={{ zIndex: 1 }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
                   style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                {step}
              </div>
              <div className="pt-1.5">
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                  {emoji} {title}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ（O/CO） ── */}
      <section className="px-5 pb-6">
        <button
          onClick={() => setShowMore(v => !v)}
          className="w-full text-left"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="flex items-center justify-between rounded-2xl px-4 py-3"
               style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>よくある質問</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{showMore ? '閉じる ▲' : '開く ▼'}</span>
          </div>
        </button>
        {showMore && (
          <div className="mt-2 flex flex-col gap-2">
            {[
              {
                q: 'Googleアカウントで何かされませんか？',
                a: 'メールの読み書き・SNS投稿・他サービスへのアクセスは一切しません。ログインはFirebaseのデータ保存（UID取得）のためだけです。',
              },
              {
                q: '難しくないですか？',
                a: 'プレイするたびにタップするだけです。動きの入力も選択式。計算は全て自動で行います。',
              },
              {
                q: '後で課金されますか？',
                a: '完全無料です。広告も課金要素も一切ありません。ずっと無料で使えます。',
              },
              {
                q: '本当に役立ちますか？',
                a: '「損切りラインを数値で決める」ことができるアプリです。感覚ではなく数字で判断できるので、無駄な投資が減ります。',
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl px-4 py-3"
                   style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Q. {q}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>A. {a}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 最終CTA ── */}
      <section
        className="px-5 pt-4 pb-10 text-center flex flex-col items-center gap-3"
        style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #fffbeb 100%)' }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
          今日から、数字で判断しよう。
        </p>
        <button
          onClick={() => handleStart('footer')}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl font-bold cursor-pointer
                     active:scale-95 transition-transform"
          style={{
            maxWidth: 320,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
            fontSize: 15,
          }}
        >
          <IconGoogle />
          Googleで無料スタート
        </button>
        <div className="flex items-center gap-1.5" style={{ color: '#94a3b8', fontSize: 11 }}>
          <IconShield />
          <span>安全・無料・ログインだけ</span>
        </div>
      </section>
    </div>
  );
}
