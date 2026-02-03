import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0e27',
          darker: '#060914',
          light: '#1a1d35',
          lighter: '#252945',
        },
        neon: {
          cyan: '#00d9ff',
          'cyan-bright': '#00f2ff',
          purple: '#7c3aed',
          'purple-light': '#a855f7',
          green: '#10b981',
          red: '#ef4444',
          orange: '#f59e0b',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00d9ff, 0 0 20px rgba(0, 217, 255, 0.3)',
        'neon-cyan-lg': '0 0 10px #00d9ff, 0 0 40px rgba(0, 217, 255, 0.4)',
        'neon-purple': '0 0 5px #7c3aed, 0 0 20px rgba(124, 58, 237, 0.3)',
        'neon-green': '0 0 5px #10b981, 0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-red': '0 0 5px #ef4444, 0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 5px #00d9ff, 0 0 20px rgba(0, 217, 255, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 10px #00d9ff, 0 0 40px rgba(0, 217, 255, 0.5)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'border-glow': {
          '0%': { borderColor: 'rgba(0, 217, 255, 0.5)' },
          '100%': { borderColor: 'rgba(0, 217, 255, 1)' },
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 50%, #0a0e27 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
