# N3 文法マスター

JLPT N3 Grammar Study App — React + Supabase + Vercel

---

## Quick Setup

### Phase 1: Local Project

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your Supabase credentials
cp .env.example .env
# Edit .env with your values (see Phase 2)

# 3. Run the dev server
npm run dev
# → Opens at http://localhost:5173
```

### Phase 2: Supabase Database

1. Create a new project at https://supabase.com/dashboard
2. Go to **Settings → API** and copy your **Project URL** and **anon key** into `.env`
3. Go to **SQL Editor** and run these files in order:

| Order | File | What it does |
|-------|------|-------------|
| 1st | `sql/01_create_tables.sql` | Creates all 7 tables |
| 2nd | `sql/02_rls_policies.sql` | Enables security policies |
| 3rd | `sql/03_seed_data.sql` | Seeds Week 1 data |

4. Go to **Authentication → Users** → Add your user account (check "Auto Confirm")

### Phase 3: Verify

Run `npm run dev` — you should see the login page, sign in, and see data counts on each tab.

---

## Project Structure

```
n3-grammar-master/
├── index.html                  # Entry point
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── .env.example                # Environment template
├── .gitignore
│
├── sql/                        # Run these in Supabase SQL Editor
│   ├── 01_create_tables.sql    # Table definitions
│   ├── 02_rls_policies.sql     # Row Level Security
│   └── 03_seed_data.sql        # Week 1 grammar + conjunctions + quizzes
│
└── src/
    ├── main.jsx                # React entry
    ├── index.css               # Global styles & CSS variables
    ├── App.jsx                 # Root: auth check + tab routing
    │
    ├── lib/
    │   ├── supabase.js         # Supabase client init
    │   └── constants.js        # Marking categories, nav tabs, etc.
    │
    ├── hooks/
    │   ├── useAuth.js          # Session management, sign in/out
    │   ├── useGrammar.js       # Fetch grammar points, groups, conjunctions, quizzes
    │   ├── useCardMarks.js     # Read/write the 6-category card marks
    │   └── useProgress.js      # Quiz results + study streak tracking
    │
    ├── components/
    │   ├── Layout.jsx          # App shell (header + nav tabs)
    │   ├── Auth.jsx            # Login page
    │   ├── MarkingPanel.jsx    # 6-category marking buttons
    │   └── LoadingSpinner.jsx  # Loading indicator
    │
    └── pages/
        ├── GrammarPage.jsx     # Grammar reference (compare + list view)
        ├── QuizPage.jsx        # Quiz with mode selection
        ├── CardsPage.jsx       # Flashcards with progressive reveal
        └── ProgressPage.jsx    # Dashboard, stats, streak
```

---

## Next Steps

The pages currently show placeholder content with data counts from Supabase. To complete the app:

1. **Migrate prototype UI** — Copy the component code from `prototype-v2.jsx` into each page file, replacing hardcoded arrays with the hook data already imported
2. **Add more grammar weeks** — Run more INSERT queries in `sql/03_seed_data.sql` pattern
3. **Deploy to Vercel** — Push to GitHub, import in Vercel, add env vars

See the full build guide (`N3_Grammar_Master_Build_Guide.md`) for detailed instructions on each step.

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `grammar_groups` | Groups of similar patterns for comparison |
| `grammar_points` | Individual grammar patterns with formation + examples |
| `conjunctions` | Conjunction reference list |
| `quiz_questions` | Quiz questions linked to groups |
| `user_card_marks` | Your 6-category marks per card |
| `user_quiz_results` | Quiz scores + per-question results |
| `user_streaks` | Daily study tracking for streak |
