const pptxgen = require("pptxgenjs");

// ── カラーパレット ────────────────────────
const C = {
  dark:     "0F172A",   // スライドタイトル背景
  card:     "FFFFFF",   // カード白
  bg:       "F8FAFC",   // ライトグレー背景
  border:   "E2E8F0",
  amber:    "D97706",   // メインアクセント
  amberLt:  "FEF3C7",
  blue:     "2563EB",
  blueLt:   "EFF6FF",
  green:    "059669",
  greenLt:  "F0FDF4",
  red:      "DC2626",
  redLt:    "FEF2F2",
  purple:   "7C3AED",
  text:     "0F172A",
  sub:      "475569",
  muted:    "94A3B8",
  white:    "FFFFFF",
};

const makeShadow = () => ({
  type: "outer", blur: 8, offset: 2, angle: 135,
  color: "000000", opacity: 0.08
});

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "クレーンAna プロダクトロードマップ";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 1 — タイトル
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // 左アクセントバー
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.amber }, line: { type: "none" }
  });

  // amber top stripe
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.amber }, line: { type: "none" }
  });

  // タグライン
  s.addText("PRODUCT ROADMAP", {
    x: 0.45, y: 1.3, w: 9, h: 0.35,
    fontSize: 10, fontFace: "Calibri", bold: true,
    color: C.amber, charSpacing: 6, margin: 0
  });

  // メインタイトル
  s.addText("クレーンAna を\n「プロダクト」にする", {
    x: 0.45, y: 1.75, w: 8.8, h: 1.9,
    fontSize: 44, fontFace: "Calibri", bold: true,
    color: C.white, margin: 0
  });

  // サブタイトル
  s.addText("localhost から月1万円を稼ぐまでの技術ロードマップ", {
    x: 0.45, y: 3.7, w: 8.8, h: 0.45,
    fontSize: 16, fontFace: "Calibri",
    color: C.muted, margin: 0
  });

  // フェーズバッジ 3つ
  const phases = [
    { label: "PHASE 1", sub: "公開する", x: 0.45 },
    { label: "PHASE 2", sub: "繋ぎ止める", x: 3.55 },
    { label: "PHASE 3", sub: "課金する", x: 6.65 },
  ];
  phases.forEach(p => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: p.x, y: 4.55, w: 2.8, h: 0.72,
      fill: { color: "1E2A3A" }, line: { color: C.amber, pt: 1 }
    });
    s.addText(p.label, {
      x: p.x + 0.12, y: 4.58, w: 1.2, h: 0.3,
      fontSize: 9, bold: true, color: C.amber, margin: 0
    });
    s.addText(p.sub, {
      x: p.x + 0.12, y: 4.87, w: 2.5, h: 0.28,
      fontSize: 13, bold: true, color: C.white, margin: 0
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 2 — 現状の問題 4つ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // ヘッダーバー
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { type: "none" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.04,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addText("今のアプリに足りない 4 つのもの", {
    x: 0.4, y: 0, w: 9, h: 0.9,
    fontSize: 22, bold: true, fontFace: "Calibri",
    color: C.white, valign: "middle", margin: 0
  });

  const cards = [
    { emoji: "💾", title: "データがローカルのみ", body: "localStorage に保存 → 機種変・ブラウザ変更で全消え。ユーザーが継続使用できない。", accent: C.red,   accentLt: C.redLt },
    { emoji: "🔐", title: "ログイン機能がない",   body: "誰が使っているか追跡不可。フリーミアム課金の前提となる「ユーザー識別」ができない。", accent: C.blue,  accentLt: C.blueLt },
    { emoji: "💳", title: "課金機能がない",       body: "収益ゼロ。Note.com / Stripe / いずれの手段でも「お金を受け取る仕組み」が未整備。", accent: C.amber, accentLt: C.amberLt },
    { emoji: "🌐", title: "URL が localhost",    body: "他人が使えない。Vercel 等でホスティングしなければ、アプリとして存在しない。", accent: C.purple, accentLt: "F3F0FF" },
  ];

  const xs = [0.25, 5.12];
  const ys = [1.18, 3.3];
  cards.forEach((c, i) => {
    const x = xs[i % 2];
    const y = ys[Math.floor(i / 2)];
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 1.82,
      fill: { color: C.card }, line: { color: C.border, pt: 1 },
      shadow: makeShadow()
    });
    // 左アクセントバー
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h: 1.82,
      fill: { color: c.accent }, line: { type: "none" }
    });
    // emoji
    s.addText(c.emoji, {
      x: x + 0.18, y: y + 0.18, w: 0.6, h: 0.5,
      fontSize: 26, margin: 0
    });
    // タイトル
    s.addText(c.title, {
      x: x + 0.18, y: y + 0.65, w: 4.3, h: 0.35,
      fontSize: 14, bold: true, color: C.text, margin: 0
    });
    // 本文
    s.addText(c.body, {
      x: x + 0.18, y: y + 1.0, w: 4.3, h: 0.68,
      fontSize: 10.5, color: C.sub, margin: 0
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 3 — 3 フェーズ概観
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { type: "none" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.04,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addText("3 フェーズ ロードマップ", {
    x: 0.4, y: 0, w: 9, h: 0.9,
    fontSize: 22, bold: true, color: C.white, valign: "middle", margin: 0
  });

  const phases = [
    {
      num: "01", label: "公開する", time: "今日〜2日",
      color: C.green, lt: C.greenLt,
      items: ["Vercel でデプロイ（無料）", "ドメイン取得（任意）", "PWA manifest 確認", "友人5人に URL を送る"],
      outcome: "世界中からアクセス可能になる"
    },
    {
      num: "02", label: "繋ぎ止める", time: "〜2週間",
      color: C.blue, lt: C.blueLt,
      items: ["Firebase Auth（Googleログイン）", "Firestore にデータ移行", "複数デバイス同期", "初回ユーザー10人を獲得"],
      outcome: "ユーザーデータが消えなくなる"
    },
    {
      num: "03", label: "課金する", time: "〜1ヶ月",
      color: C.amber, lt: C.amberLt,
      items: ["Note.com メンバーシップ開設", "フリーミアム機能分岐", "Stripe 課金（本格版）", "月収 ¥10,000 達成"],
      outcome: "収益が発生し始める"
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.25 + i * 3.22;
    // カード背景
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.1, w: 3.0, h: 4.15,
      fill: { color: C.card }, line: { color: C.border, pt: 1 },
      shadow: makeShadow()
    });
    // ナンバーバッジ
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.1, w: 3.0, h: 0.72,
      fill: { color: p.color }, line: { type: "none" }
    });
    s.addText(p.num, {
      x: x + 0.15, y: 1.12, w: 0.65, h: 0.65,
      fontSize: 28, bold: true, color: C.white, valign: "middle", margin: 0
    });
    s.addText(p.label, {
      x: x + 0.82, y: 1.13, w: 2.0, h: 0.35,
      fontSize: 18, bold: true, color: C.white, margin: 0
    });
    s.addText(p.time, {
      x: x + 0.82, y: 1.47, w: 2.0, h: 0.28,
      fontSize: 10, color: C.white, margin: 0
    });

    // リスト
    p.items.forEach((item, j) => {
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.2, y: 2.0 + j * 0.52, w: 0.18, h: 0.18,
        fill: { color: p.color }, line: { type: "none" }
      });
      s.addText(item, {
        x: x + 0.46, y: 1.97 + j * 0.52, w: 2.42, h: 0.35,
        fontSize: 11, color: C.text, margin: 0
      });
    });

    // アウトカム
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.12, y: 4.62, w: 2.76, h: 0.44,
      fill: { color: p.lt }, line: { color: p.color, pt: 1 }
    });
    s.addText("✓ " + p.outcome, {
      x: x + 0.2, y: 4.64, w: 2.6, h: 0.38,
      fontSize: 9.5, bold: true, color: p.color, valign: "middle", margin: 0
    });
  });

  // 矢印
  [3.27, 6.49].forEach(ax => {
    s.addShape(pres.shapes.LINE, {
      x: ax, y: 3.2, w: 0.18, h: 0,
      line: { color: C.muted, pt: 1.5, dashType: "dash" }
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 4 — Phase 1: Vercel デプロイ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.green }, line: { type: "none" }
  });
  s.addText("PHASE 1", {
    x: 0.4, y: 0.04, w: 2, h: 0.3,
    fontSize: 9, bold: true, color: C.white, charSpacing: 4, margin: 0
  });
  s.addText("公開する — 今日できる", {
    x: 0.4, y: 0.32, w: 9, h: 0.52,
    fontSize: 22, bold: true, color: C.white, valign: "middle", margin: 0
  });

  // コマンド手順カード（左）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.25, y: 1.05, w: 5.5, h: 4.25,
    fill: { color: C.card }, line: { color: C.border, pt: 1 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.25, y: 1.05, w: 5.5, h: 0.42,
    fill: { color: "1E293B" }, line: { type: "none" }
  });
  s.addText("デプロイ手順（コマンド 3 行）", {
    x: 0.42, y: 1.07, w: 5.1, h: 0.38,
    fontSize: 12, bold: true, color: C.white, valign: "middle", margin: 0
  });

  const steps = [
    { n: "1", cmd: "npm install -g vercel", desc: "Vercel CLI をインストール" },
    { n: "2", cmd: "npm run build", desc: "本番ビルドを作成" },
    { n: "3", cmd: "vercel --prod", desc: "デプロイ完了 → URLが発行される" },
  ];
  steps.forEach((st, i) => {
    const y = 1.65 + i * 1.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.42, y, w: 0.38, h: 0.38,
      fill: { color: C.green }, line: { type: "none" }
    });
    s.addText(st.n, {
      x: 0.42, y, w: 0.38, h: 0.38,
      fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
    });
    s.addText(st.desc, {
      x: 0.9, y: y + 0.02, w: 4.65, h: 0.3,
      fontSize: 11, color: C.sub, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.42, y: y + 0.4, w: 5.15, h: 0.42,
      fill: { color: "1E293B" }, line: { type: "none" }
    });
    s.addText(st.cmd, {
      x: 0.55, y: y + 0.42, w: 5.0, h: 0.35,
      fontSize: 11.5, fontFace: "Consolas", color: "4ADE80", margin: 0
    });
  });

  // 右：ポイントカード
  const rights = [
    { icon: "🆓", title: "完全無料", body: "Vercel の Hobby プランは無料。クレジットカード不要。" },
    { icon: "⚡", title: "5分で完了", body: "GitHubと連携すれば次回以降は push するだけで自動デプロイ。" },
    { icon: "📱", title: "PWA 対応", body: "https:// になることで「ホーム画面に追加」が動作するようになる。" },
  ];
  rights.forEach((r, i) => {
    const y = 1.05 + i * 1.42;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.95, y, w: 3.8, h: 1.25,
      fill: { color: C.card }, line: { color: C.border, pt: 1 },
      shadow: makeShadow()
    });
    s.addText(r.icon, {
      x: 6.1, y: y + 0.12, w: 0.55, h: 0.5,
      fontSize: 22, margin: 0
    });
    s.addText(r.title, {
      x: 6.7, y: y + 0.12, w: 2.85, h: 0.32,
      fontSize: 13, bold: true, color: C.text, margin: 0
    });
    s.addText(r.body, {
      x: 6.1, y: y + 0.5, w: 3.45, h: 0.6,
      fontSize: 10.5, color: C.sub, margin: 0
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 5 — Phase 2: Firebase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.blue }, line: { type: "none" }
  });
  s.addText("PHASE 2", {
    x: 0.4, y: 0.04, w: 2, h: 0.3,
    fontSize: 9, bold: true, color: C.white, charSpacing: 4, margin: 0
  });
  s.addText("繋ぎ止める — Firebase 導入（約2週間）", {
    x: 0.4, y: 0.32, w: 9, h: 0.52,
    fontSize: 22, bold: true, color: C.white, valign: "middle", margin: 0
  });

  // Before / After
  ["Before", "After"].forEach((ba, i) => {
    const x = i === 0 ? 0.25 : 5.12;
    const color = i === 0 ? C.red : C.green;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 4.65, h: 4.3,
      fill: { color: C.card }, line: { color: C.border, pt: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 4.65, h: 0.5,
      fill: { color: color }, line: { type: "none" }
    });
    s.addText(ba, {
      x: x + 0.15, y: 1.07, w: 4.3, h: 0.44,
      fontSize: 16, bold: true, color: C.white, valign: "middle", margin: 0
    });
  });

  const befores = [
    "データは localStorage のみ",
    "機種変したら全データ消える",
    "ログイン機能なし",
    "誰が使っているか不明",
    "フリーミアム実装できない",
  ];
  befores.forEach((b, i) => {
    s.addText("✕  " + b, {
      x: 0.42, y: 1.72 + i * 0.54, w: 4.28, h: 0.42,
      fontSize: 11, color: C.red, margin: 0
    });
  });

  const afters = [
    "Firestore にデータ保存",
    "どの端末でも同期",
    "Google ログイン（1タップ）",
    "ユーザー別データ管理",
    "有料/無料 の分岐が可能",
  ];
  afters.forEach((a, i) => {
    s.addText("✓  " + a, {
      x: 5.28, y: 1.72 + i * 0.54, w: 4.28, h: 0.42,
      fontSize: 11, color: C.green, margin: 0
    });
  });

  // 矢印
  s.addShape(pres.shapes.LINE, {
    x: 4.94, y: 3.2, w: 0.14, h: 0,
    line: { color: C.muted, pt: 2 }
  });
  s.addText("→", {
    x: 4.82, y: 3.0, w: 0.35, h: 0.4,
    fontSize: 20, color: C.muted, align: "center", margin: 0
  });

  // 工数バッジ
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.25, y: 5.0, w: 9.5, h: 0.44,
    fill: { color: C.blueLt }, line: { color: C.blue, pt: 1 }
  });
  s.addText("実装工数目安：Firebase Auth 2日 + Firestore 移行 3日 + テスト 2日 ＝ 合計 約 1 週間（週末2回分）", {
    x: 0.42, y: 5.02, w: 9.2, h: 0.38,
    fontSize: 10.5, bold: true, color: C.blue, valign: "middle", margin: 0
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 6 — Phase 3: 課金
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addText("PHASE 3", {
    x: 0.4, y: 0.04, w: 2, h: 0.3,
    fontSize: 9, bold: true, color: C.white, charSpacing: 4, margin: 0
  });
  s.addText("課金する — 2 択で選ぶ", {
    x: 0.4, y: 0.32, w: 9, h: 0.52,
    fontSize: 22, bold: true, color: C.white, valign: "middle", margin: 0
  });

  // Option A
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.25, y: 1.05, w: 4.65, h: 4.3,
    fill: { color: C.card }, line: { color: C.amber, pt: 2 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.25, y: 1.05, w: 4.65, h: 0.7,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addText("Option A  ★推奨", {
    x: 0.4, y: 1.08, w: 4.3, h: 0.3,
    fontSize: 13, bold: true, color: C.white, margin: 0
  });
  s.addText("Note.com メンバーシップ", {
    x: 0.4, y: 1.38, w: 4.3, h: 0.3,
    fontSize: 15, bold: true, color: C.white, margin: 0
  });

  const aItems = [
    ["開発工数", "ゼロ（ノーコード）"],
    ["月額設定", "¥500〜¥980"],
    ["始められる", "今日から"],
    ["手数料", "約 20%（Note 側）"],
    ["向いている人", "まず稼ぎたい人"],
  ];
  aItems.forEach(([k, v], i) => {
    const y = 1.95 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.42, y, w: 4.3, h: 0.44,
      fill: { color: i % 2 === 0 ? "FFFBEB" : C.card }, line: { type: "none" }
    });
    s.addText(k, {
      x: 0.55, y: y + 0.06, w: 1.8, h: 0.3,
      fontSize: 10.5, color: C.sub, margin: 0
    });
    s.addText(v, {
      x: 2.4, y: y + 0.06, w: 2.2, h: 0.3,
      fontSize: 11, bold: true, color: C.text, margin: 0
    });
  });

  // Option B
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.12, y: 1.05, w: 4.65, h: 4.3,
    fill: { color: C.card }, line: { color: C.border, pt: 1 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.12, y: 1.05, w: 4.65, h: 0.7,
    fill: { color: "475569" }, line: { type: "none" }
  });
  s.addText("Option B", {
    x: 5.27, y: 1.08, w: 4.3, h: 0.3,
    fontSize: 13, bold: true, color: C.white, margin: 0
  });
  s.addText("Stripe + Firebase（本格版）", {
    x: 5.27, y: 1.38, w: 4.3, h: 0.3,
    fontSize: 15, bold: true, color: C.white, margin: 0
  });

  const bItems = [
    ["開発工数", "2〜3週間"],
    ["月額設定", "自由（¥300〜）"],
    ["始められる", "実装完了後"],
    ["手数料", "約 3.6%（Stripe）"],
    ["向いている人", "スケールしたい人"],
  ];
  bItems.forEach(([k, v], i) => {
    const y = 1.95 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.28, y, w: 4.3, h: 0.44,
      fill: { color: i % 2 === 0 ? "F8FAFC" : C.card }, line: { type: "none" }
    });
    s.addText(k, {
      x: 5.42, y: y + 0.06, w: 1.8, h: 0.3,
      fontSize: 10.5, color: C.sub, margin: 0
    });
    s.addText(v, {
      x: 7.24, y: y + 0.06, w: 2.0, h: 0.3,
      fontSize: 11, bold: true, color: C.text, margin: 0
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 7 — 技術スタック全体像
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { type: "none" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.04,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addText("技術スタック 選定表", {
    x: 0.4, y: 0, w: 9, h: 0.9,
    fontSize: 22, bold: true, color: C.white, valign: "middle", margin: 0
  });

  const headers = ["カテゴリ", "ツール", "月額コスト", "難易度", "優先度"];
  const colW = [2.0, 2.6, 1.7, 1.5, 1.4];
  const rows = [
    ["ホスティング", "Vercel（Hobby）", "無料", "★☆☆", "今すぐ"],
    ["認証", "Firebase Auth", "無料（〜10万MAU）", "★★☆", "2週間後"],
    ["データベース", "Firestore", "無料〜$25/月", "★★☆", "2週間後"],
    ["課金（簡単）", "Note.com", "手数料20%のみ", "★☆☆", "今すぐ"],
    ["課金（本格）", "Stripe", "手数料3.6%〜", "★★★", "1ヶ月後"],
    ["分析", "Firebase Analytics", "無料", "★☆☆", "2週間後"],
    ["エラー監視", "Sentry（無料枠）", "無料（5k events）", "★☆☆", "公開後"],
  ];

  // ヘッダー行
  let xOff = 0.25;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: xOff, y: 1.05, w: colW[i], h: 0.45,
      fill: { color: "1E293B" }, line: { color: "334155", pt: 0.5 }
    });
    s.addText(h, {
      x: xOff + 0.08, y: 1.07, w: colW[i] - 0.1, h: 0.38,
      fontSize: 10.5, bold: true, color: C.white, valign: "middle", margin: 0
    });
    xOff += colW[i];
  });

  // データ行
  rows.forEach((row, ri) => {
    xOff = 0.25;
    const y = 1.5 + ri * 0.54;
    const bgColor = ri % 2 === 0 ? C.card : "F1F5F9";
    const prioColor = row[4] === "今すぐ" ? C.green : row[4] === "2週間後" ? C.blue : C.muted;

    row.forEach((cell, ci) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: xOff, y, w: colW[ci], h: 0.5,
        fill: { color: bgColor }, line: { color: C.border, pt: 0.5 }
      });
      if (ci === 4) {
        s.addText(cell, {
          x: xOff + 0.08, y: y + 0.08, w: colW[ci] - 0.16, h: 0.34,
          fontSize: 10, bold: true, color: prioColor, valign: "middle", margin: 0
        });
      } else {
        s.addText(cell, {
          x: xOff + 0.1, y: y + 0.08, w: colW[ci] - 0.15, h: 0.34,
          fontSize: 10, color: C.text, valign: "middle", margin: 0
        });
      }
      xOff += colW[ci];
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 8 — 工数・コスト見積もり
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { type: "none" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.04,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addText("工数 & コスト 見積もり", {
    x: 0.4, y: 0, w: 9, h: 0.9,
    fontSize: 22, bold: true, color: C.white, valign: "middle", margin: 0
  });

  // タイムラインバー
  const tasks = [
    { name: "Vercel デプロイ",      days: 0.5, phase: 1, color: C.green  },
    { name: "GitHub 連携・CI設定",  days: 0.5, phase: 1, color: C.green  },
    { name: "Firebase Auth 実装",   days: 2,   phase: 2, color: C.blue   },
    { name: "Firestore 移行",       days: 3,   phase: 2, color: C.blue   },
    { name: "Note.com 開設",        days: 0.5, phase: 3, color: C.amber  },
    { name: "フリーミアム分岐実装", days: 3,   phase: 3, color: C.amber  },
    { name: "Stripe 課金実装",      days: 5,   phase: 3, color: C.purple },
  ];

  const maxDays = 14;
  const barAreaW = 6.5;
  const labelW = 2.8;

  tasks.forEach((t, i) => {
    const y = 1.1 + i * 0.54;
    const barW = (t.days / maxDays) * barAreaW;

    s.addText(t.name, {
      x: 0.25, y: y + 0.06, w: labelW, h: 0.35,
      fontSize: 11, color: C.text, margin: 0
    });
    // バー背景
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.25 + labelW, y: y + 0.08, w: barAreaW, h: 0.32,
      fill: { color: "E2E8F0" }, line: { type: "none" }
    });
    // バー本体
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.25 + labelW, y: y + 0.08, w: Math.max(barW, 0.05), h: 0.32,
      fill: { color: t.color }, line: { type: "none" }
    });
    // 日数ラベル
    s.addText(t.days + "日", {
      x: 0.25 + labelW + barAreaW + 0.1, y: y + 0.08, w: 0.6, h: 0.32,
      fontSize: 10, bold: true, color: C.sub, valign: "middle", margin: 0
    });
  });

  // 合計
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.25, y: 5.0, w: 9.5, h: 0.44,
    fill: { color: "1E293B" }, line: { type: "none" }
  });
  s.addText("合計工数（Phase 1〜3）： 約 15日 ／ 月 ¥0〜¥3,000 のコストで運用可能（Firebase無料枠内）", {
    x: 0.42, y: 5.03, w: 9.2, h: 0.36,
    fontSize: 11, bold: true, color: C.white, valign: "middle", margin: 0
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 9 — やる vs 後回し
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { type: "none" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.04,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addText("スコープ定義 — やる vs 後回し vs やらない", {
    x: 0.4, y: 0, w: 9, h: 0.9,
    fontSize: 22, bold: true, color: C.white, valign: "middle", margin: 0
  });

  const cols = [
    {
      title: "今すぐやる ✓",
      color: C.green, lt: C.greenLt,
      items: [
        "Vercel デプロイ",
        "PWA manifest 確認",
        "Note.com 開設・無料記事1本",
        "X アカウント開設",
        "友人5人に URL 送付",
        "A8.net アフィリエイト登録",
      ]
    },
    {
      title: "2週間以内に ▷",
      color: C.blue, lt: C.blueLt,
      items: [
        "Firebase Auth 実装",
        "Firestore データ移行",
        "Note.com 有料マガジン開始",
        "フリーミアム 機能分岐",
        "ユーザーリサーチ（5人）",
        "アフィリエイトリンク設置",
      ]
    },
    {
      title: "後回しでいい ×",
      color: C.muted, lt: "F1F5F9",
      items: [
        "App Store / Google Play 申請",
        "独自ドメイン取得",
        "Stripe 本格課金（Note.comで十分）",
        "多言語対応",
        "プッシュ通知",
        "AI 機能追加",
      ]
    },
  ];

  cols.forEach((col, i) => {
    const x = 0.25 + i * 3.22;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 3.0, h: 4.3,
      fill: { color: C.card }, line: { color: C.border, pt: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 3.0, h: 0.55,
      fill: { color: col.color }, line: { type: "none" }
    });
    s.addText(col.title, {
      x: x + 0.12, y: 1.08, w: 2.74, h: 0.48,
      fontSize: 13, bold: true, color: C.white, valign: "middle", margin: 0
    });

    col.items.forEach((item, j) => {
      const y = 1.75 + j * 0.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.1, y: y - 0.04, w: 2.78, h: 0.46,
        fill: { color: j % 2 === 0 ? col.lt : C.card }, line: { type: "none" }
      });
      s.addText(item, {
        x: x + 0.2, y: y, w: 2.65, h: 0.36,
        fontSize: 10.5, color: C.text, valign: "middle", margin: 0
      });
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slide 10 — 今週やること（Action）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.amber }, line: { type: "none" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.amber }, line: { type: "none" }
  });

  s.addText("今週やること — 5 つのアクション", {
    x: 0.45, y: 0.2, w: 9.2, h: 0.6,
    fontSize: 26, bold: true, color: C.white, margin: 0
  });

  const actions = [
    { n: "01", title: "npm run build && vercel --prod",  sub: "アプリを世界に公開する。所要時間：15分" },
    { n: "02", title: "X アカウントを今日開設",          sub: "「クレーンゲームを数学で攻略するアプリ作った」と投稿" },
    { n: "03", title: "Note.com の無料記事を1本書く",    sub: "「橋渡し期待値入門」—— ここから有料読者が生まれる" },
    { n: "04", title: "A8.net に登録してメルカリ申請",   sub: "紹介1件 ¥500〜¥1,000。記事に張るだけで収益化" },
    { n: "05", title: "友人5人に URL を送って感想を聞く", sub: "「3回以上使い続けてくれたか」が最大の検証指標" },
  ];

  actions.forEach((a, i) => {
    const y = 1.0 + i * 0.9;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 9.3, h: 0.78,
      fill: { color: "1A2744" }, line: { color: "2D3F60", pt: 1 }
    });
    // 番号
    s.addText(a.n, {
      x: 0.55, y: y + 0.08, w: 0.55, h: 0.55,
      fontSize: 18, bold: true, color: C.amber,
      fontFace: "Consolas", valign: "middle", align: "center", margin: 0
    });
    s.addText(a.title, {
      x: 1.2, y: y + 0.05, w: 8.3, h: 0.32,
      fontSize: 13.5, bold: true, color: C.white,
      fontFace: "Consolas", margin: 0
    });
    s.addText(a.sub, {
      x: 1.2, y: y + 0.38, w: 8.3, h: 0.28,
      fontSize: 10.5, color: C.muted, margin: 0
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 出力
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
pres.writeFile({ fileName: "crane_product_roadmap.pptx" })
  .then(() => console.log("✅ crane_product_roadmap.pptx を作成しました"))
  .catch(e => console.error("❌ エラー:", e));
