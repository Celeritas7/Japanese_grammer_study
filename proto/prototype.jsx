import { useState, useEffect, useCallback } from "react";

// ─── Sample Data from 総まとめ Week 1 ───────────────────────────
const grammarData = [
  {
    id: 1,
    week: 1,
    day: 1,
    title: "〜みたい",
    meaning: "Looks like, seems like, appears to be",
    formation: ["Verb plain form + みたい", "いadj + みたい", "なadj + みたい", "Noun + みたい"],
    examples: [
      { jp: "雨が降るみたいだ。", en: "It looks like it will rain." },
      { jp: "彼は学生みたいだ。", en: "He seems like a student." },
    ],
    notes: "More casual than ようだ. Used in spoken Japanese.",
  },
  {
    id: 2,
    week: 1,
    day: 1,
    title: "〜らしい",
    meaning: "It seems that, apparently, I heard that",
    formation: ["Verb plain form + らしい", "いadj + らしい", "なadj + らしい", "Noun + らしい"],
    examples: [
      { jp: "明日は雨らしい。", en: "Apparently it will rain tomorrow." },
      { jp: "あの店は美味しいらしい。", en: "I heard that restaurant is delicious." },
    ],
    notes: "Based on information heard from others or indirect evidence.",
  },
  {
    id: 3,
    week: 1,
    day: 1,
    title: "〜っぽい",
    meaning: "~ish, -like, tends to be",
    formation: ["Verb ます stem + っぽい", "いadj stem + っぽい", "Noun + っぽい"],
    examples: [
      { jp: "彼は怒りっぽい。", en: "He tends to get angry easily." },
      { jp: "この色は白っぽい。", en: "This color is whitish." },
    ],
    notes: "Casual. Often implies a tendency or resemblance. Can be slightly negative.",
  },
  {
    id: 4,
    week: 1,
    day: 4,
    title: "〜ようにする",
    meaning: "To make an effort to, to try to",
    formation: ["Verb dictionary form + ようにする", "Verb ない form + ようにする"],
    examples: [
      { jp: "毎日運動するようにしています。", en: "I make an effort to exercise every day." },
      { jp: "遅刻しないようにする。", en: "I'll try not to be late." },
    ],
    notes: "Expresses conscious effort to create a habit or change behavior.",
  },
  {
    id: 5,
    week: 1,
    day: 4,
    title: "〜ようになる",
    meaning: "To come to, to become able to",
    formation: ["Verb dictionary form + ようになる", "Verb ない form + ようになる"],
    examples: [
      { jp: "日本語が話せるようになった。", en: "I became able to speak Japanese." },
      { jp: "朝早く起きられるようになった。", en: "I came to be able to wake up early." },
    ],
    notes: "Describes a gradual change in ability or state over time.",
  },
  {
    id: 6,
    week: 1,
    day: 5,
    title: "〜ように (Explanation)",
    meaning: "In such a way that, so that (explains manner)",
    formation: ["Verb plain form + ように", "Noun + の + ように"],
    examples: [
      { jp: "後ろにいる学生に見えるように大きく書く。", en: "Write big so students in the back can see." },
    ],
    notes: "Used with non-volitional verbs like 見える, 聞こえる.",
  },
  {
    id: 7,
    week: 1,
    day: 5,
    title: "〜ように (Request)",
    meaning: "Please do ~ (polite request/instruction)",
    formation: ["Verb plain form + ように", "Verb ない form + ように"],
    examples: [
      { jp: "忘れないようにメモを取ってください。", en: "Please take notes so you don't forget." },
      { jp: "遅れないようにしてください。", en: "Please make sure not to be late." },
    ],
    notes: "Softer than a direct command. Often used with ください.",
  },
  {
    id: 8,
    week: 1,
    day: 5,
    title: "〜ように (Hope)",
    meaning: "I hope that ~, I pray that ~",
    formation: ["Verb ます + ように", "Verb ません + ように"],
    examples: [
      { jp: "試験に受かりますように。", en: "I hope I pass the exam." },
      { jp: "雨が降りませんように。", en: "I hope it doesn't rain." },
    ],
    notes: "Used for wishes, often at shrines or when expressing hopes.",
  },
];

const conjunctions = [
  { kanji: "", kana: "けれども", meaning: "But (Formal)" },
  { kanji: "", kana: "しかし", meaning: "But (Spoken)" },
  { kanji: "", kana: "でも", meaning: "But (Casual)" },
  { kanji: "", kana: "が", meaning: "But (Written/Spoken, Formal)" },
  { kanji: "実は", kana: "じつは", meaning: "Actually" },
  { kanji: "", kana: "すると", meaning: "Then" },
  { kanji: "", kana: "そして", meaning: "And then" },
  { kanji: "", kana: "それから", meaning: "After that" },
  { kanji: "", kana: "それに", meaning: "In addition" },
  { kanji: "", kana: "ですから", meaning: "So" },
  { kanji: "", kana: "ところが", meaning: "However" },
  { kanji: "", kana: "ところで", meaning: "By the way" },
  { kanji: "", kana: "もし", meaning: "If" },
];

// ─── Quiz Data ──────────────────────────────────────────────────
const quizQuestions = [
  {
    id: 1,
    question: "雨が降る＿＿だ。 (It looks like it will rain.)",
    options: ["みたい", "らしい", "っぽい", "ように"],
    correct: 0,
    grammar: "〜みたい",
  },
  {
    id: 2,
    question: "明日は雨＿＿。 (Apparently it will rain tomorrow.)",
    options: ["みたいだ", "らしい", "っぽい", "ようだ"],
    correct: 1,
    grammar: "〜らしい",
  },
  {
    id: 3,
    question: "彼は怒り＿＿。 (He tends to get angry easily.)",
    options: ["みたい", "らしい", "っぽい", "ようだ"],
    correct: 2,
    grammar: "〜っぽい",
  },
  {
    id: 4,
    question: "日本語が話せる＿＿なった。 (I became able to speak Japanese.)",
    options: ["ように", "みたいに", "らしく", "っぽく"],
    correct: 0,
    grammar: "〜ようになる",
  },
  {
    id: 5,
    question: "毎日運動する＿＿しています。 (I make an effort to exercise daily.)",
    options: ["ために", "ように", "みたいに", "らしく"],
    correct: 1,
    grammar: "〜ようにする",
  },
  {
    id: 6,
    question: "試験に受かり＿＿。 (I hope I pass the exam.)",
    options: ["ますように", "たいです", "みたいです", "らしいです"],
    correct: 0,
    grammar: "〜ように (Hope)",
  },
];

// ─── Styles ─────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "#F7F3EE",
    fontFamily: "'Noto Sans JP', 'Helvetica Neue', sans-serif",
    color: "#2C2420",
  },
  header: {
    background: "linear-gradient(135deg, #2C2420 0%, #4A3728 100%)",
    padding: "20px 24px 16px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 20px rgba(44,36,32,0.15)",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#F7F3EE",
    margin: 0,
    letterSpacing: "0.5px",
  },
  headerSub: {
    fontSize: "11px",
    color: "#C4A882",
    margin: "2px 0 0",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  nav: {
    display: "flex",
    gap: "2px",
    background: "#3A2D24",
    padding: "4px",
    borderRadius: "12px",
    marginTop: "14px",
  },
  navBtn: (active) => ({
    flex: 1,
    padding: "10px 8px",
    border: "none",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.25s ease",
    background: active ? "#C4A882" : "transparent",
    color: active ? "#2C2420" : "#A89580",
    fontFamily: "'Noto Sans JP', sans-serif",
  }),
  content: {
    padding: "20px 16px 100px",
    maxWidth: "640px",
    margin: "0 auto",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "14px",
    boxShadow: "0 1px 8px rgba(44,36,32,0.06)",
    border: "1px solid rgba(196,168,130,0.15)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  grammarTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#2C2420",
    margin: "0 0 4px",
  },
  grammarMeaning: {
    fontSize: "14px",
    color: "#7A6B5D",
    margin: "0 0 14px",
    lineHeight: 1.5,
  },
  tag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 500,
    background: "#F0E8DD",
    color: "#8B7355",
    marginRight: "6px",
    marginBottom: "6px",
  },
  weekTag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 600,
    background: "#C4A882",
    color: "#2C2420",
    marginRight: "6px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#A89580",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    margin: "16px 0 8px",
  },
  exampleBox: {
    background: "#FAF7F3",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "8px",
    borderLeft: "3px solid #C4A882",
  },
  exampleJp: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#2C2420",
    margin: "0 0 4px",
  },
  exampleEn: {
    fontSize: "13px",
    color: "#8B7355",
    margin: 0,
    fontStyle: "italic",
  },
  formationItem: {
    fontSize: "14px",
    color: "#4A3728",
    padding: "6px 0",
    borderBottom: "1px dashed rgba(196,168,130,0.3)",
    lineHeight: 1.5,
  },
  searchBar: {
    width: "100%",
    padding: "14px 18px 14px 44px",
    border: "2px solid rgba(196,168,130,0.3)",
    borderRadius: "12px",
    fontSize: "15px",
    background: "#FFFFFF",
    outline: "none",
    fontFamily: "'Noto Sans JP', sans-serif",
    color: "#2C2420",
    boxSizing: "border-box",
    marginBottom: "16px",
    transition: "border-color 0.2s ease",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  filterBtn: (active) => ({
    padding: "8px 16px",
    borderRadius: "20px",
    border: active ? "2px solid #C4A882" : "2px solid rgba(196,168,130,0.25)",
    background: active ? "#C4A882" : "transparent",
    color: active ? "#2C2420" : "#8B7355",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Noto Sans JP', sans-serif",
  }),
  // Quiz styles
  quizOption: (state) => ({
    display: "block",
    width: "100%",
    padding: "16px 18px",
    border: state === "correct" ? "2px solid #5A8F5A" : state === "wrong" ? "2px solid #C25B4E" : "2px solid rgba(196,168,130,0.25)",
    borderRadius: "12px",
    background: state === "correct" ? "#EAF4EA" : state === "wrong" ? "#FAEAE8" : "#FFFFFF",
    fontSize: "16px",
    cursor: state === "unanswered" ? "pointer" : "default",
    textAlign: "left",
    marginBottom: "10px",
    fontFamily: "'Noto Sans JP', sans-serif",
    color: "#2C2420",
    transition: "all 0.2s ease",
    fontWeight: state === "correct" ? 600 : 400,
    boxSizing: "border-box",
  }),
  quizProgress: {
    height: "6px",
    borderRadius: "3px",
    background: "#EDE6DC",
    overflow: "hidden",
    marginBottom: "20px",
  },
  quizProgressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #C4A882, #8B7355)",
    borderRadius: "3px",
    transition: "width 0.4s ease",
  }),
  // Flashcard styles
  flashcard: (flipped) => ({
    width: "100%",
    minHeight: "260px",
    borderRadius: "18px",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: flipped
      ? "linear-gradient(135deg, #2C2420 0%, #4A3728 100%)"
      : "#FFFFFF",
    color: flipped ? "#F7F3EE" : "#2C2420",
    boxShadow: "0 4px 24px rgba(44,36,32,0.12)",
    border: flipped ? "none" : "2px solid rgba(196,168,130,0.2)",
    transition: "all 0.4s ease",
    textAlign: "center",
    boxSizing: "border-box",
    userSelect: "none",
  }),
  fcBtnRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    justifyContent: "center",
  },
  fcBtn: (color) => ({
    padding: "12px 28px",
    borderRadius: "12px",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Noto Sans JP', sans-serif",
    background: color === "red" ? "#C25B4E" : color === "yellow" ? "#C4A882" : "#5A8F5A",
    color: "#FFFFFF",
    transition: "transform 0.15s ease",
  }),
  // Progress styles
  statCard: {
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 1px 8px rgba(44,36,32,0.06)",
    border: "1px solid rgba(196,168,130,0.15)",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: 700,
    color: "#C4A882",
    margin: "0 0 4px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#8B7355",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
  },
  weekProgress: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid rgba(196,168,130,0.15)",
  },
  weekProgressBar: {
    flex: 1,
    height: "8px",
    borderRadius: "4px",
    background: "#EDE6DC",
    overflow: "hidden",
  },
  weekProgressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: pct === 100 ? "#5A8F5A" : "linear-gradient(90deg, #C4A882, #8B7355)",
    borderRadius: "4px",
    transition: "width 0.4s ease",
  }),
};

// ─── Components ──────────────────────────────────────────────────

function GrammarReference() {
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const days = [...new Set(grammarData.map((g) => g.day))].sort();

  const filtered = grammarData.filter((g) => {
    const matchSearch =
      !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.meaning.toLowerCase().includes(search.toLowerCase());
    const matchDay = selectedDay === null || g.day === selectedDay;
    return matchSearch && matchDay;
  });

  return (
    <div>
      <div style={{ position: "relative", marginBottom: "4px" }}>
        <span style={{ position: "absolute", left: "16px", top: "14px", fontSize: "18px", opacity: 0.4 }}>🔍</span>
        <input
          style={styles.searchBar}
          placeholder="Search grammar points..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#C4A882")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(196,168,130,0.3)")}
        />
      </div>

      <div style={styles.filterRow}>
        <button style={styles.filterBtn(selectedDay === null)} onClick={() => setSelectedDay(null)}>
          All Days
        </button>
        {days.map((d) => (
          <button key={d} style={styles.filterBtn(selectedDay === d)} onClick={() => setSelectedDay(d)}>
            Day {d}
          </button>
        ))}
      </div>

      {filtered.map((g) => (
        <div
          key={g.id}
          style={{
            ...styles.card,
            cursor: "pointer",
            ...(expanded === g.id ? { boxShadow: "0 4px 20px rgba(44,36,32,0.1)" } : {}),
          }}
          onClick={() => setExpanded(expanded === g.id ? null : g.id)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={styles.grammarTitle}>{g.title}</p>
              <p style={styles.grammarMeaning}>{g.meaning}</p>
            </div>
            <span style={{ fontSize: "20px", color: "#C4A882", transform: expanded === g.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }}>
              ▾
            </span>
          </div>
          <div>
            <span style={styles.weekTag}>Week {g.week}</span>
            <span style={styles.tag}>Day {g.day}</span>
          </div>

          {expanded === g.id && (
            <div style={{ marginTop: "16px", animation: "fadeIn 0.3s ease" }}>
              <p style={styles.sectionTitle}>Formation</p>
              {g.formation.map((f, i) => (
                <div key={i} style={styles.formationItem}>{f}</div>
              ))}

              <p style={styles.sectionTitle}>Examples</p>
              {g.examples.map((ex, i) => (
                <div key={i} style={styles.exampleBox}>
                  <p style={styles.exampleJp}>{ex.jp}</p>
                  <p style={styles.exampleEn}>{ex.en}</p>
                </div>
              ))}

              {g.notes && (
                <>
                  <p style={styles.sectionTitle}>Notes</p>
                  <p style={{ fontSize: "14px", color: "#7A6B5D", lineHeight: 1.6, margin: 0 }}>{g.notes}</p>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const q = quizQuestions[currentQ];
  const progress = ((currentQ + (selected !== null ? 1 : 0)) / quizQuestions.length) * 100;

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === q.correct;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { qId: q.id, correct: isCorrect }]);
  };

  const next = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div style={{ ...styles.card, textAlign: "center", padding: "40px 24px" }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>
          {pct >= 80 ? "🎉" : pct >= 50 ? "📚" : "💪"}
        </div>
        <p style={{ fontSize: "32px", fontWeight: 700, color: "#2C2420", margin: "0 0 4px" }}>
          {score}/{quizQuestions.length}
        </p>
        <p style={{ fontSize: "14px", color: "#8B7355", margin: "0 0 24px" }}>
          {pct >= 80 ? "Excellent work!" : pct >= 50 ? "Good effort, keep studying!" : "Keep practicing, you'll get there!"}
        </p>
        <div style={{ marginBottom: "24px" }}>
          {answers.map((a, i) => (
            <span key={i} style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: a.correct ? "#5A8F5A" : "#C25B4E", margin: "0 4px" }} />
          ))}
        </div>
        <button onClick={restart} style={{ ...styles.fcBtn("yellow"), padding: "14px 40px", fontSize: "15px" }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", color: "#8B7355" }}>
          Question {currentQ + 1} of {quizQuestions.length}
        </span>
        <span style={{ fontSize: "13px", color: "#8B7355" }}>{score} correct</span>
      </div>
      <div style={styles.quizProgress}>
        <div style={styles.quizProgressFill(progress)} />
      </div>

      <div style={styles.card}>
        <span style={styles.tag}>{q.grammar}</span>
        <p style={{ fontSize: "18px", fontWeight: 600, color: "#2C2420", margin: "12px 0 20px", lineHeight: 1.6 }}>
          {q.question}
        </p>

        {q.options.map((opt, i) => {
          let state = "unanswered";
          if (selected !== null) {
            if (i === q.correct) state = "correct";
            else if (i === selected) state = "wrong";
          }
          return (
            <button key={i} style={styles.quizOption(state)} onClick={() => handleSelect(i)}>
              {opt}
            </button>
          );
        })}

        {selected !== null && (
          <div style={{ textAlign: "right", marginTop: "8px" }}>
            <button
              onClick={next}
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                border: "none",
                background: "#2C2420",
                color: "#F7F3EE",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {currentQ < quizQuestions.length - 1 ? "Next →" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Flashcards() {
  const allCards = [...grammarData, ...conjunctions.map((c, i) => ({
    id: 100 + i,
    title: c.kana,
    meaning: c.meaning,
    kanji: c.kanji,
    type: "conjunction",
  }))];

  const [deck, setDeck] = useState(allCards);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0 });

  const card = deck[current];
  const isGrammar = !card?.type;

  const rate = (level) => {
    setStats({ ...stats, [level]: stats[level] + 1 });
    setFlipped(false);
    if (current < deck.length - 1) {
      setCurrent(current + 1);
    } else {
      setCurrent(0);
    }
  };

  const resetDeck = () => {
    setCurrent(0);
    setFlipped(false);
    setStats({ easy: 0, medium: 0, hard: 0 });
  };

  if (!card) return null;

  const total = stats.easy + stats.medium + stats.hard;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", color: "#8B7355" }}>
          Card {current + 1} / {deck.length}
        </span>
        {total > 0 && (
          <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#8B7355" }}>
            <span>✅ {stats.easy}</span>
            <span>🟡 {stats.medium}</span>
            <span>🔴 {stats.hard}</span>
          </div>
        )}
      </div>

      <div style={styles.flashcard(flipped)} onClick={() => setFlipped(!flipped)}>
        {!flipped ? (
          <>
            {isGrammar && <span style={{ ...styles.weekTag, marginBottom: "16px" }}>Week {card.week} · Day {card.day}</span>}
            {!isGrammar && <span style={{ ...styles.tag, marginBottom: "16px" }}>Conjunction</span>}
            <p style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 8px" }}>{card.title}</p>
            {card.kanji && <p style={{ fontSize: "16px", color: "#8B7355", margin: 0 }}>{card.kanji}</p>}
            <p style={{ fontSize: "13px", color: "#A89580", marginTop: "20px" }}>Tap to reveal</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px", color: "#C4A882" }}>{card.title}</p>
            <p style={{ fontSize: "18px", margin: "0 0 16px", lineHeight: 1.6 }}>{card.meaning}</p>
            {isGrammar && card.examples && card.examples[0] && (
              <div style={{ background: "rgba(247,243,238,0.1)", borderRadius: "10px", padding: "12px 16px", width: "100%", boxSizing: "border-box" }}>
                <p style={{ fontSize: "16px", margin: "0 0 4px" }}>{card.examples[0].jp}</p>
                <p style={{ fontSize: "13px", margin: 0, opacity: 0.7, fontStyle: "italic" }}>{card.examples[0].en}</p>
              </div>
            )}
          </>
        )}
      </div>

      {flipped && (
        <div style={styles.fcBtnRow}>
          <button style={styles.fcBtn("red")} onClick={() => rate("hard")}>
            Hard
          </button>
          <button style={styles.fcBtn("yellow")} onClick={() => rate("medium")}>
            Good
          </button>
          <button style={styles.fcBtn("green")} onClick={() => rate("easy")}>
            Easy
          </button>
        </div>
      )}

      {total > 0 && (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={resetDeck}
            style={{
              padding: "8px 20px",
              border: "1px solid rgba(196,168,130,0.3)",
              borderRadius: "8px",
              background: "transparent",
              color: "#8B7355",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            Reset Deck
          </button>
        </div>
      )}
    </div>
  );
}

function Progress() {
  // Simulated progress data
  const weekData = [
    { week: 1, label: "みたい・らしい・ように", progress: 75 },
    { week: 2, label: "ばかり・さえ・こそ・に関して", progress: 30 },
    { week: 3, label: "とおり・まま・っぱなし", progress: 0 },
    { week: 4, label: "ところ・うちに・ことだ", progress: 0 },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>8</p>
          <p style={styles.statLabel}>Points Studied</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statNumber, color: "#5A8F5A" }}>67%</p>
          <p style={styles.statLabel}>Quiz Accuracy</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ ...styles.statNumber, color: "#C25B4E" }}>3</p>
          <p style={styles.statLabel}>Needs Review</p>
        </div>
      </div>

      <div style={styles.card}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#2C2420", margin: "0 0 16px" }}>
          Weekly Progress
        </p>
        {weekData.map((w) => (
          <div key={w.week} style={styles.weekProgress}>
            <div style={{ minWidth: "60px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#2C2420" }}>Week {w.week}</span>
            </div>
            <div style={styles.weekProgressBar}>
              <div style={styles.weekProgressFill(w.progress)} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#8B7355", minWidth: "36px", textAlign: "right" }}>
              {w.progress}%
            </span>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#2C2420", margin: "0 0 12px" }}>
          Flashcard Mastery
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {grammarData.map((g) => {
            const mastery = g.id <= 3 ? "mastered" : g.id <= 5 ? "learning" : "new";
            const colors = {
              mastered: { bg: "#EAF4EA", border: "#5A8F5A", text: "#3D6B3D" },
              learning: { bg: "#FFF8EC", border: "#C4A882", text: "#8B7355" },
              new: { bg: "#F5F0EB", border: "#D4C9BA", text: "#A89580" },
            };
            const c = colors[mastery];
            return (
              <span
                key={g.id}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.text,
                }}
              >
                {g.title}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "16px", marginTop: "14px", fontSize: "12px", color: "#8B7355" }}>
          <span>🟢 Mastered</span>
          <span>🟡 Learning</span>
          <span>⚪ New</span>
        </div>
      </div>

      <div style={{ ...styles.card, background: "linear-gradient(135deg, #2C2420 0%, #4A3728 100%)", color: "#F7F3EE" }}>
        <p style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 8px" }}>Study Streak</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div
              key={i}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 600,
                background: i < 5 ? "#C4A882" : "rgba(196,168,130,0.2)",
                color: i < 5 ? "#2C2420" : "#8B7355",
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: "#A89580", margin: 0 }}>5 day streak! Keep it going 🔥</p>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("grammar");

  const tabs = [
    { id: "grammar", label: "文法", sub: "Grammar" },
    { id: "quiz", label: "問題", sub: "Quiz" },
    { id: "cards", label: "カード", sub: "Cards" },
    { id: "progress", label: "進捗", sub: "Stats" },
  ];

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        button:active { transform: scale(0.97); }
        input::placeholder { color: #B0A090; }
      `}</style>

      <header style={styles.header}>
        <p style={styles.headerTitle}>N3 文法マスター</p>
        <p style={styles.headerSub}>JLPT Grammar Study</p>
        <nav style={styles.nav}>
          {tabs.map((t) => (
            <button key={t.id} style={styles.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
              <div style={{ fontSize: "14px" }}>{t.label}</div>
              <div style={{ fontSize: "10px", marginTop: "2px", opacity: 0.8 }}>{t.sub}</div>
            </button>
          ))}
        </nav>
      </header>

      <main style={styles.content}>
        {tab === "grammar" && <GrammarReference />}
        {tab === "quiz" && <Quiz />}
        {tab === "cards" && <Flashcards />}
        {tab === "progress" && <Progress />}
      </main>
    </div>
  );
}
