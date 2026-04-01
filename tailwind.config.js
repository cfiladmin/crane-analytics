/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        arcade: {
          // ── Light Gaming Bento テーマ ──
          bg:      '#F8FAFC',   // ページ背景（クールホワイト）
          card:    '#FFFFFF',   // カード白
          cardAlt: '#F1F5F9',   // 薄いグレーカード
          border:  '#E2E8F0',   // ライトボーダー
          amber:   '#D97706',   // 白背景でコントラスト確保のため深め
          red:     '#DC2626',
          green:   '#059669',
          blue:    '#2563EB',
          purple:  '#7C3AED',
          muted:   '#94A3B8',
          text:    '#0F172A',   // ほぼ黒
          subtext: '#475569',   // スレートグレー
        },
      },
      boxShadow: {
        'bento':    '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'bento-md': '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'bento-lg': '0 8px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)',
        'neon-amber': '0 0 16px rgba(217,119,6,0.25)',
        'neon-green': '0 0 16px rgba(5,150,105,0.25)',
        'neon-red':   '0 0 16px rgba(220,38,38,0.3)',
        'neon-blue':  '0 0 16px rgba(37,99,235,0.25)',
      },
      animation: {
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
        'bounce-num': 'bounceNum 0.2s ease-out',
        'pulse-red':  'pulseRed 1s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(24px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        bounceNum: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseRed: {
          '0%,100%': { backgroundColor: '#F8FAFC' },
          '50%':     { backgroundColor: '#FFF1F2' },
        },
      },
    },
  },
  plugins: [],
};
