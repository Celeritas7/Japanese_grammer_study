# N3 文法マスター — Build Guide

## Full-Stack App: React + Supabase + Vercel

---

## Phase 1: Local Project Setup

### Step 1.1 — Create the Vite project

```bash
npm create vite@latest n3-grammar-master -- --template react
cd n3-grammar-master
npm install
```

### Step 1.2 — Install dependencies

```bash
npm install @supabase/supabase-js react-router-dom lucide-react
```

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Supabase client for auth + database |
| `react-router-dom` | Page navigation (Grammar, Quiz, Cards, Progress) |
| `lucide-react` | Clean icon library |

### Step 1.3 — Set up folder structure

Create this structure inside `/src`:

```
src/
├── components/
│   ├── Layout.jsx            # App shell (header + nav)
│   ├── ComparisonTable.jsx   # Side-by-side grammar comparison
│   ├── GrammarCard.jsx       # Expandable grammar card
│   ├── FlashCard.jsx         # Progressive reveal flashcard
│   ├── QuizQuestion.jsx      # Single quiz question
│   └── MarkingPanel.jsx      # 6-category marking buttons
├── pages/
│   ├── GrammarPage.jsx       # Grammar reference (compare + list)
│   ├── QuizPage.jsx          # Quiz with mode selection
│   ├── CardsPage.jsx         # Flashcard decks
│   └── ProgressPage.jsx      # Dashboard & stats
├── lib/
│   └── supabase.js           # Supabase client init
├── hooks/
│   └── useGrammar.js         # Data fetching hooks
├── App.jsx
├── main.jsx
└── index.css
```

Run these commands to create the folders:

```bash
mkdir -p src/components src/pages src/lib src/hooks
```

### Step 1.4 — Verify it runs

```bash
npm run dev
```

Open `http://localhost:5173` — you should see the Vite + React starter page.

---

## Phase 2: Supabase Project & Database

### Step 2.1 — Create a new Supabase project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Name it: `n3-grammar-master`
4. Choose a strong database password (save it somewhere safe)
5. Select the region closest to you (Tokyo `ap-northeast-1` is ideal)
6. Click **"Create new project"** — wait ~2 minutes

### Step 2.2 — Get your API keys

1. Go to **Settings → API** in the left sidebar
2. Copy these two values (you'll need them in Step 3.1):
   - **Project URL** — looks like `https://xxxx.supabase.co`
   - **anon/public key** — the long `eyJ...` string under "Project API keys"

### Step 2.3 — Create the database tables

Go to **SQL Editor** in the left sidebar, paste the following, and click **"Run"**:

```sql
-- ============================================================
-- GRAMMAR GROUPS
-- ============================================================
CREATE TABLE grammar_groups (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  custom BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GRAMMAR POINTS
-- ============================================================
CREATE TABLE grammar_points (
  id SERIAL PRIMARY KEY,
  group_id TEXT REFERENCES grammar_groups(id),
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  meaning TEXT NOT NULL,
  nuance TEXT,
  notes TEXT,
  formation JSONB,           -- { verb: "...", iAdj: "...", naAdj: "...", noun: "..." }
  formation_list TEXT[],     -- Array of formation rules as strings
  examples JSONB,            -- [{ jp: "...", en: "..." }, ...]
  jlpt_level TEXT DEFAULT 'N3',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONJUNCTIONS
-- ============================================================
CREATE TABLE conjunctions (
  id SERIAL PRIMARY KEY,
  kanji TEXT DEFAULT '',
  kana TEXT NOT NULL,
  meaning TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  grammar_point_id INTEGER REFERENCES grammar_points(id),
  group_id TEXT REFERENCES grammar_groups(id),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,      -- Array of answer choices
  correct_index INTEGER NOT NULL,
  question_type TEXT DEFAULT 'fill_blank',  -- fill_blank, choose_meaning, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER CARD MARKS (your 6 categories)
-- ============================================================
CREATE TABLE user_card_marks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  grammar_point_id INTEGER REFERENCES grammar_points(id),
  conjunction_id INTEGER REFERENCES conjunctions(id),
  mark_level INTEGER NOT NULL CHECK (mark_level BETWEEN 0 AND 5),
  -- 0=Not Marked, 1=Monthly Review, 2=Can't Converse,
  -- 3=Can't Write, 4=Can't Use, 5=Don't Know
  marked_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one mark per user per item
  UNIQUE(user_id, grammar_point_id),
  UNIQUE(user_id, conjunction_id)
);

-- ============================================================
-- USER QUIZ RESULTS
-- ============================================================
CREATE TABLE user_quiz_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_mode TEXT NOT NULL,          -- 'group' or 'random'
  group_id TEXT REFERENCES grammar_groups(id),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  answers JSONB,                     -- [{ questionId, correct: bool }, ...]
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER STUDY STREAK
-- ============================================================
CREATE TABLE user_streaks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  study_date DATE NOT NULL,
  activities JSONB DEFAULT '[]',    -- What they did that day
  UNIQUE(user_id, study_date)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_grammar_points_group ON grammar_points(group_id);
CREATE INDEX idx_grammar_points_week ON grammar_points(week, day);
CREATE INDEX idx_card_marks_user ON user_card_marks(user_id);
CREATE INDEX idx_quiz_results_user ON user_quiz_results(user_id);
CREATE INDEX idx_streaks_user ON user_streaks(user_id, study_date);
```

### Step 2.4 — Enable Row Level Security (RLS)

Still in SQL Editor, run this:

```sql
-- Enable RLS on user tables
ALTER TABLE user_card_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users manage own marks"
  ON user_card_marks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own quiz results"
  ON user_quiz_results FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own streaks"
  ON user_streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grammar data is readable by everyone (no auth needed to browse)
ALTER TABLE grammar_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE conjunctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Grammar points readable" ON grammar_points FOR SELECT USING (true);
CREATE POLICY "Grammar groups readable" ON grammar_groups FOR SELECT USING (true);
CREATE POLICY "Conjunctions readable" ON conjunctions FOR SELECT USING (true);
CREATE POLICY "Quiz questions readable" ON quiz_questions FOR SELECT USING (true);
```

### Step 2.5 — Set up Authentication

1. Go to **Authentication → Providers** in Supabase dashboard
2. **Email** is enabled by default — that's fine for personal use
3. (Optional) Enable **Google** or **GitHub** if you want social login
4. Go to **Authentication → URL Configuration**
5. Set **Site URL** to `http://localhost:5173` for now (you'll update to Vercel URL later)

### Step 2.6 — Create your user account

1. Go to **Authentication → Users**
2. Click **"Add User" → "Create new user"**
3. Enter your email and a password
4. Check **"Auto Confirm User"**
5. Click **"Create User"**

---

## Phase 3: Connect React to Supabase

### Step 3.1 — Create environment file

Create a `.env` file in your project root (NOT inside `src/`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Replace with your actual values from Step 2.2.

**Important:** Add `.env` to your `.gitignore` file:

```
# .gitignore - add this line:
.env
```

### Step 3.2 — Create the Supabase client

Create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3.3 — Create the data-fetching hook

Create `src/hooks/useGrammar.js`:

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGrammarPoints(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('grammar_points')
        .select('*, grammar_groups(label)')
        .order('week', { ascending: true })
        .order('day', { ascending: true })
        .order('sort_order', { ascending: true });

      if (filters.week) query = query.eq('week', filters.week);
      if (filters.day) query = query.eq('day', filters.day);
      if (filters.groupId) query = query.eq('group_id', filters.groupId);

      const { data: result, error: err } = await query;
      if (err) setError(err);
      else setData(result || []);
      setLoading(false);
    }
    fetch();
  }, [filters.week, filters.day, filters.groupId]);

  return { data, loading, error };
}

export function useGrammarGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('grammar_groups')
        .select('*')
        .order('week', { ascending: true })
        .order('day', { ascending: true });

      if (!error) setGroups(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { groups, loading };
}

export function useConjunctions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: result, error } = await supabase
        .from('conjunctions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error) setData(result || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { data, loading };
}
```

### Step 3.4 — Create the card marks hook

Create `src/hooks/useCardMarks.js`:

```javascript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useCardMarks() {
  const [marks, setMarks] = useState({});

  // Fetch all marks for current user
  const fetchMarks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_card_marks')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      const marksMap = {};
      data.forEach(m => {
        const key = m.grammar_point_id
          ? `grammar:${m.grammar_point_id}`
          : `conjunction:${m.conjunction_id}`;
        marksMap[key] = m.mark_level;
      });
      setMarks(marksMap);
    }
  }, []);

  useEffect(() => { fetchMarks(); }, [fetchMarks]);

  // Upsert a mark
  const markCard = async (type, itemId, level) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      mark_level: level,
      marked_at: new Date().toISOString(),
    };

    if (type === 'grammar') {
      payload.grammar_point_id = itemId;
    } else {
      payload.conjunction_id = itemId;
    }

    const conflictColumn = type === 'grammar'
      ? 'user_id,grammar_point_id'
      : 'user_id,conjunction_id';

    const { error } = await supabase
      .from('user_card_marks')
      .upsert(payload, { onConflict: conflictColumn });

    if (!error) {
      const key = `${type}:${itemId}`;
      setMarks(prev => ({ ...prev, [key]: level }));
    }
  };

  return { marks, markCard, fetchMarks };
}
```

### Step 3.5 — Test the connection

Temporarily add this to `src/App.jsx` to verify everything works:

```javascript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from('grammar_groups')
        .select('count');
      if (error) setStatus(`Error: ${error.message}`);
      else setStatus('Connected to Supabase!');
    }
    test();
  }, []);

  return <div style={{ padding: 40 }}><h1>{status}</h1></div>;
}
export default App;
```

Run `npm run dev` — you should see "Connected to Supabase!" (the table will be empty, but the connection works).

---

## Phase 4: Seed Your Grammar Data

### Step 4.1 — Seed grammar groups

Go to **Supabase SQL Editor** and run:

```sql
INSERT INTO grammar_groups (id, label, week, day, custom, sort_order) VALUES
  ('appearance', 'Appearance · みたい vs らしい vs っぽい', 1, 1, false, 1),
  ('youni', 'ように · する vs なる', 1, 4, false, 2),
  ('youni-usage', 'ように · Explanation vs Request vs Hope', 1, 5, false, 3);

-- Add more groups as you work through the 総まとめ weeks
```

### Step 4.2 — Seed grammar points

```sql
INSERT INTO grammar_points
  (group_id, week, day, title, meaning, nuance, notes, formation, formation_list, examples, sort_order)
VALUES
  (
    'appearance', 1, 1, '〜みたい',
    'Looks like, seems like, appears to be',
    'Direct personal observation, casual',
    'More casual than ようだ. Used in spoken Japanese.',
    '{"verb": "食べる + みたい", "iAdj": "高い + みたい", "naAdj": "静か + みたい", "noun": "学生 + みたい"}',
    ARRAY['Verb plain form + みたい', 'いadj + みたい', 'なadj + みたい', 'Noun + みたい'],
    '[{"jp": "雨が降るみたいだ。", "en": "It looks like it will rain."}, {"jp": "彼は学生みたいだ。", "en": "He seems like a student."}]',
    1
  ),
  (
    'appearance', 1, 1, '〜らしい',
    'It seems that, apparently, I heard that',
    'Hearsay or indirect evidence',
    'Based on information heard from others or indirect evidence.',
    '{"verb": "食べる + らしい", "iAdj": "高い + らしい", "naAdj": "静か + らしい", "noun": "学生 + らしい"}',
    ARRAY['Verb plain form + らしい', 'いadj + らしい', 'なadj + らしい', 'Noun + らしい'],
    '[{"jp": "明日は雨らしい。", "en": "Apparently it will rain tomorrow."}, {"jp": "あの店は美味しいらしい。", "en": "I heard that restaurant is delicious."}]',
    2
  ),
  (
    'appearance', 1, 1, '〜っぽい',
    '~ish, -like, tends to be',
    'Tendency, -ish quality, slightly negative',
    'Casual. Often implies a tendency or resemblance. Can be slightly negative.',
    '{"verb": "食べ + っぽい (rare)", "iAdj": "高 + っぽい (rare)", "naAdj": "—", "noun": "子供 + っぽい"}',
    ARRAY['Verb ます stem + っぽい', 'いadj stem + っぽい', 'Noun + っぽい'],
    '[{"jp": "彼は怒りっぽい。", "en": "He tends to get angry easily."}, {"jp": "この色は白っぽい。", "en": "This color is whitish."}]',
    3
  ),
  (
    'youni', 1, 4, '〜ようにする',
    'To make an effort to, to try to',
    'Conscious effort / habit building',
    'Expresses conscious effort to create a habit or change behavior.',
    '{"verb": "食べる + ようにする", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb dictionary form + ようにする', 'Verb ない form + ようにする'],
    '[{"jp": "毎日運動するようにしています。", "en": "I make an effort to exercise every day."}, {"jp": "遅刻しないようにする。", "en": "I will try not to be late."}]',
    4
  ),
  (
    'youni', 1, 4, '〜ようになる',
    'To come to, to become able to',
    'Natural/gradual change over time',
    'Describes a gradual change in ability or state over time.',
    '{"verb": "話せる + ようになる", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb dictionary form + ようになる', 'Verb ない form + ようになる'],
    '[{"jp": "日本語が話せるようになった。", "en": "I became able to speak Japanese."}, {"jp": "朝早く起きられるようになった。", "en": "I came to be able to wake up early."}]',
    5
  ),
  (
    'youni-usage', 1, 5, '〜ように (Explanation)',
    'In such a way that, so that (explains manner)',
    'Manner/way (non-volitional verbs)',
    'Used with non-volitional verbs like 見える, 聞こえる.',
    '{"verb": "見える + ように", "iAdj": "—", "naAdj": "—", "noun": "Noun + の + ように"}',
    ARRAY['Verb plain form + ように', 'Noun + の + ように'],
    '[{"jp": "後ろにいる学生に見えるように大きく書く。", "en": "Write big so students in the back can see."}]',
    6
  ),
  (
    'youni-usage', 1, 5, '〜ように (Request)',
    'Please do ~ (polite request/instruction)',
    'Polite instruction, softer command',
    'Softer than a direct command. Often used with ください.',
    '{"verb": "忘れない + ように", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb plain form + ように', 'Verb ない form + ように'],
    '[{"jp": "忘れないようにメモを取ってください。", "en": "Please take notes so you don''t forget."}]',
    7
  ),
  (
    'youni-usage', 1, 5, '〜ように (Hope)',
    'I hope that ~, I pray that ~',
    'Wish / prayer / hope',
    'Used for wishes, often at shrines or when expressing hopes.',
    '{"verb": "受かります + ように", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb ます + ように', 'Verb ません + ように'],
    '[{"jp": "試験に受かりますように。", "en": "I hope I pass the exam."}, {"jp": "雨が降りませんように。", "en": "I hope it doesn''t rain."}]',
    8
  );
```

### Step 4.3 — Seed conjunctions

```sql
INSERT INTO conjunctions (kana, kanji, meaning, sort_order) VALUES
  ('けれども', '', 'But (Formal)', 1),
  ('しかし', '', 'But (Spoken)', 2),
  ('でも', '', 'But (Casual)', 3),
  ('が', '', 'But (Written/Spoken, Formal)', 4),
  ('じつは', '実は', 'Actually', 5),
  ('すると', '', 'Then', 6),
  ('そして', '', 'And then', 7),
  ('それから', '', 'After that', 8),
  ('それに', '', 'In addition', 9),
  ('ですから', '', 'So', 10),
  ('ところが', '', 'However', 11),
  ('ところで', '', 'By the way', 12),
  ('もし', '', 'If', 13);
```

### Step 4.4 — Seed quiz questions

```sql
INSERT INTO quiz_questions (group_id, question, options, correct_index, question_type) VALUES
  ('appearance', '雨が降る＿＿だ。 (It looks like it will rain.)',
   ARRAY['みたい', 'らしい', 'っぽい', 'ように'], 0, 'fill_blank'),
  ('appearance', '明日は雨＿＿。 (Apparently it will rain tomorrow.)',
   ARRAY['みたいだ', 'らしい', 'っぽい', 'ようだ'], 1, 'fill_blank'),
  ('appearance', '彼は怒り＿＿。 (He tends to get angry easily.)',
   ARRAY['みたい', 'らしい', 'っぽい', 'ようだ'], 2, 'fill_blank'),
  ('youni', '日本語が話せる＿＿なった。 (I became able to speak Japanese.)',
   ARRAY['ように', 'みたいに', 'らしく', 'っぽく'], 0, 'fill_blank'),
  ('youni', '毎日運動する＿＿しています。 (I make an effort to exercise daily.)',
   ARRAY['ために', 'ように', 'みたいに', 'らしく'], 1, 'fill_blank'),
  ('youni-usage', '試験に受かり＿＿。 (I hope I pass the exam.)',
   ARRAY['ますように', 'たいです', 'みたいです', 'らしいです'], 0, 'fill_blank');
```

### Step 4.5 — Verify the seed data

Go to **Table Editor** in Supabase and confirm:
- `grammar_groups` → 3 rows
- `grammar_points` → 8 rows
- `conjunctions` → 13 rows
- `quiz_questions` → 6 rows

---

## Phase 5: Migrate Prototype Components

### Step 5.1 — Copy the prototype

The prototype code you already have works as a self-contained React component. To migrate it:

1. Copy the prototype `.jsx` file into `src/App.jsx`
2. It will work immediately with hardcoded data
3. Then gradually replace the hardcoded `grammarData`, `conjunctions`, and `quizQuestions` arrays with Supabase calls

### Step 5.2 — Replace hardcoded data with hooks

In each component, replace static arrays with hook calls. For example, in the Grammar Reference section:

**Before (hardcoded):**
```javascript
const filtered = grammarData.filter(g => { ... });
```

**After (Supabase):**
```javascript
import { useGrammarPoints, useGrammarGroups } from '../hooks/useGrammar';

function GrammarReference() {
  const { data: grammarData, loading } = useGrammarPoints();
  const { groups: grammarGroups } = useGrammarGroups();

  if (loading) return <LoadingSpinner />;

  const filtered = grammarData.filter(g => { ... });
  // ... rest of the component stays the same
}
```

### Step 5.3 — Add authentication

Create `src/components/Auth.jsx`:

```javascript
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email, password
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

Wrap your `App.jsx` with an auth check:

```javascript
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <Auth />;

  return (
    // Your main app (the prototype code) goes here
  );
}
```

### Step 5.4 — Wire up card marking to Supabase

Replace the local `stats` state in Flashcards with the `useCardMarks` hook:

```javascript
import { useCardMarks } from '../hooks/useCardMarks';

function Flashcards() {
  const { marks, markCard } = useCardMarks();

  // When user marks a card:
  const handleMark = async (level) => {
    const isGrammar = !card.type;
    await markCard(
      isGrammar ? 'grammar' : 'conjunction',
      card.id,
      level
    );
    // Move to next card
    setRevealStep(0);
    setCurrent(current < deck.length - 1 ? current + 1 : 0);
  };
}
```

### Step 5.5 — Wire up quiz results to Supabase

After a quiz is completed:

```javascript
const saveQuizResult = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('user_quiz_results').insert({
    user_id: user.id,
    quiz_mode: mode,
    group_id: selectedGroup || null,
    total_questions: questions.length,
    correct_answers: score,
    answers: answers,
  });
};

// Call this when quiz finishes:
useEffect(() => {
  if (finished) saveQuizResult();
}, [finished]);
```

---

## Phase 6: Deploy to Vercel

### Step 6.1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: N3 Grammar Master"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/n3-grammar-master.git
git branch -M main
git push -u origin main
```

### Step 6.2 — Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New" → "Project"**
3. Import your `n3-grammar-master` repository
4. Vercel auto-detects Vite — settings should be:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add **Environment Variables:**
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
6. Click **"Deploy"**

### Step 6.3 — Update Supabase redirect URL

1. Go to Supabase **Authentication → URL Configuration**
2. Update **Site URL** to your Vercel URL (e.g., `https://n3-grammar-master.vercel.app`)
3. Add `http://localhost:5173` to **Redirect URLs** so local dev still works

### Step 6.4 — Verify deployment

Visit your Vercel URL — the app should load and connect to Supabase.

---

## Phase 7: Adding More Data (Ongoing)

As you work through the 総まとめ weeks, add more data by running INSERT queries in Supabase SQL Editor. The pattern is always:

1. Add a new `grammar_group` for the day's group
2. Add `grammar_points` for each pattern in that group
3. Add `quiz_questions` for that group
4. The app automatically picks up new data

### Recommended order (from your priority ranking):

| Priority | Source | Action |
|---|---|---|
| 1st | 総まとめ Week 2-8 | Add grammar groups + points week by week |
| 2nd | Conjunction list | Already seeded — expand with more entries |
| 3rd | います/あります | Add as a special grammar group |
| 4th | Distinguish doc | Add as custom comparison groups |

---

## Quick Reference: Key Files

| File | Purpose |
|---|---|
| `.env` | Supabase credentials (never commit this!) |
| `src/lib/supabase.js` | Supabase client |
| `src/hooks/useGrammar.js` | Data fetching for grammar, groups, conjunctions |
| `src/hooks/useCardMarks.js` | Read/write card marks |
| `src/App.jsx` | Main app (migrated from prototype) |

## Useful Supabase Dashboard Pages

| Page | URL | Use for |
|---|---|---|
| Table Editor | `/project/YOUR_ID/editor` | View/edit data visually |
| SQL Editor | `/project/YOUR_ID/sql` | Run queries, seed data |
| Auth Users | `/project/YOUR_ID/auth/users` | Manage your account |
| API Docs | `/project/YOUR_ID/api` | Auto-generated API reference |
| Logs | `/project/YOUR_ID/logs` | Debug API errors |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| "relation does not exist" | Run the CREATE TABLE SQL again (Step 2.3) |
| 401 Unauthorized | Check your `.env` keys match Supabase dashboard |
| RLS blocks inserts | Make sure you're logged in; check policies (Step 2.4) |
| Empty data after seed | Check Table Editor to confirm rows exist |
| Vercel deploy fails | Check build logs; ensure env vars are set in Vercel |
| CORS errors | Supabase handles CORS automatically; check URL spelling |
