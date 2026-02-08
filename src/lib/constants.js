// ─── Marking Categories ──────────────────────────────────────────
export const MARKING = {
  0: { label: 'Not Marked',      icon: '○',  bg: '#9CA3AF', lightBg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  1: { label: 'Monthly Review',  icon: '✓',  bg: '#10B981', lightBg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  2: { label: "Can't Converse",  icon: '💬', bg: '#8B5CF6', lightBg: '#EDE9FE', text: '#5B21B6', border: '#A78BFA' },
  3: { label: "Can't Write",     icon: '✍',  bg: '#F97316', lightBg: '#FFEDD5', text: '#9A3412', border: '#FDBA74' },
  4: { label: "Can't Use",       icon: '🤔', bg: '#EC4899', lightBg: '#FCE7F3', text: '#9D174D', border: '#F9A8D4' },
  5: { label: "Don't Know",      icon: '❌', bg: '#EF4444', lightBg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
};

// ─── JLPT Levels ─────────────────────────────────────────────────
export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

// ─── Navigation Tabs ─────────────────────────────────────────────
export const NAV_TABS = [
  { id: 'grammar',  label: '文法',   sub: 'Grammar'  },
  { id: 'quiz',     label: '問題',   sub: 'Quiz'     },
  { id: 'cards',    label: 'カード', sub: 'Cards'    },
  { id: 'progress', label: '進捗',   sub: 'Stats'    },
];
