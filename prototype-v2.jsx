import { useState, useEffect, useMemo } from "react";

// ─── Grammar Data with Group Info ────────────────────────────────
const grammarData = [
  {
    id: 1, week: 1, day: 1, groupId: "appearance",
    title: "〜みたい",
    meaning: "Looks like, seems like, appears to be",
    formation: {
      verb: "食べる + みたい",
      iAdj: "高い + みたい",
      naAdj: "静か + みたい",
      noun: "学生 + みたい",
    },
    formationList: ["Verb plain form + みたい", "いadj + みたい", "なadj + みたい", "Noun + みたい"],
    examples: [
      { jp: "雨が降るみたいだ。", en: "It looks like it will rain." },
      { jp: "彼は学生みたいだ。", en: "He seems like a student." },
    ],
    notes: "More casual than ようだ. Used in spoken Japanese.",
    nuance: "Direct personal observation, casual",
  },
  {
    id: 2, week: 1, day: 1, groupId: "appearance",
    title: "〜らしい",
    meaning: "It seems that, apparently, I heard that",
    formation: {
      verb: "食べる + らしい",
      iAdj: "高い + らしい",
      naAdj: "静か + らしい",
      noun: "学生 + らしい",
    },
    formationList: ["Verb plain form + らしい", "いadj + らしい", "なadj + らしい", "Noun + らしい"],
    examples: [
      { jp: "明日は雨らしい。", en: "Apparently it will rain tomorrow." },
      { jp: "あの店は美味しいらしい。", en: "I heard that restaurant is delicious." },
    ],
    notes: "Based on information heard from others or indirect evidence.",
    nuance: "Hearsay or indirect evidence",
  },
  {
    id: 3, week: 1, day: 1, groupId: "appearance",
    title: "〜っぽい",
    meaning: "~ish, -like, tends to be",
    formation: {
      verb: "食べ + っぽい (rare)",
      iAdj: "高 + っぽい (rare)",
      naAdj: "—",
      noun: "子供 + っぽい",
    },
    formationList: ["Verb ます stem + っぽい", "いadj stem + っぽい", "Noun + っぽい"],
    examples: [
      { jp: "彼は怒りっぽい。", en: "He tends to get angry easily." },
      { jp: "この色は白っぽい。", en: "This color is whitish." },
    ],
    notes: "Casual. Often implies a tendency or resemblance. Can be slightly negative.",
    nuance: "Tendency, -ish quality, slightly negative",
  },
  {
    id: 4, week: 1, day: 4, groupId: "youni",
    title: "〜ようにする",
    meaning: "To make an effort to, to try to",
    formation: {
      verb: "食べる + ようにする",
      iAdj: "—",
      naAdj: "—",
      noun: "—",
    },
    formationList: ["Verb dictionary form + ようにする", "Verb ない form + ようにする"],
    examples: [
      { jp: "毎日運動するようにしています。", en: "I make an effort to exercise every day." },
      { jp: "遅刻しないようにする。", en: "I'll try not to be late." },
    ],
    notes: "Expresses conscious effort to create a habit or change behavior.",
    nuance: "Conscious effort / habit building",
  },
  {
    id: 5, week: 1, day: 4, groupId: "youni",
    title: "〜ようになる",
    meaning: "To come to, to become able to",
    formation: {
      verb: "話せる + ようになる",
      iAdj: "—",
      naAdj: "—",
      noun: "—",
    },
    formationList: ["Verb dictionary form + ようになる", "Verb ない form + ようになる"],
    examples: [
      { jp: "日本語が話せるようになった。", en: "I became able to speak Japanese." },
      { jp: "朝早く起きられるようになった。", en: "I came to be able to wake up early." },
    ],
    notes: "Describes a gradual change in ability or state over time.",
    nuance: "Natural/gradual change over time",
  },
  {
    id: 6, week: 1, day: 5, groupId: "youni-usage",
    title: "〜ように (Explanation)",
    meaning: "In such a way that, so that (explains manner)",
    formation: {
      verb: "見える + ように",
      iAdj: "—",
      naAdj: "—",
      noun: "Noun + の + ように",
    },
    formationList: ["Verb plain form + ように", "Noun + の + ように"],
    examples: [
      { jp: "後ろにいる学生に見えるように大きく書く。", en: "Write big so students in the back can see." },
    ],
    notes: "Used with non-volitional verbs like 見える, 聞こえる.",
    nuance: "Manner/way (non-volitional verbs)",
  },
  {
    id: 7, week: 1, day: 5, groupId: "youni-usage",
    title: "〜ように (Request)",
    meaning: "Please do ~ (polite request/instruction)",
    formation: {
      verb: "忘れない + ように",
      iAdj: "—",
      naAdj: "—",
      noun: "—",
    },
    formationList: ["Verb plain form + ように", "Verb ない form + ように"],
    examples: [
      { jp: "忘れないようにメモを取ってください。", en: "Please take notes so you don't forget." },
    ],
    notes: "Softer than a direct command. Often used with ください.",
    nuance: "Polite instruction, softer command",
  },
  {
    id: 8, week: 1, day: 5, groupId: "youni-usage",
    title: "〜ように (Hope)",
    meaning: "I hope that ~, I pray that ~",
    formation: {
      verb: "受かります + ように",
      iAdj: "—",
      naAdj: "—",
      noun: "—",
    },
    formationList: ["Verb ます + ように", "Verb ません + ように"],
    examples: [
      { jp: "試験に受かりますように。", en: "I hope I pass the exam." },
      { jp: "雨が降りませんように。", en: "I hope it doesn't rain." },
    ],
    notes: "Used for wishes, often at shrines or when expressing hopes.",
    nuance: "Wish / prayer / hope",
  },
];

const grammarGroups = [
  { id: "appearance", label: "Appearance · みたい vs らしい vs っぽい", week: 1, day: 1, custom: false },
  { id: "youni", label: "ように · する vs なる", week: 1, day: 4, custom: false },
  { id: "youni-usage", label: "ように · Explanation vs Request vs Hope", week: 1, day: 5, custom: false },
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

// ─── Quiz generator ──────────────────────────────────────────────
function generateGroupQuiz(groupId) {
  const items = grammarData.filter(g => g.groupId === groupId);
  if (items.length < 2) return [];
  const questions = [];
  items.forEach(item => {
    item.examples.forEach(ex => {
      const pattern = item.title.replace(/[〜～]/g, "");
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const blanked = ex.jp.replace(new RegExp(escaped), "＿＿");
      if (blanked !== ex.jp) {
        const opts = items.map(i => i.title.replace(/[〜～]/g, ""));
        const correctIdx = opts.indexOf(pattern);
        questions.push({
          id: `${item.id}-${ex.jp}`,
          question: `${blanked}\n${ex.en}`,
          options: opts,
          correct: correctIdx,
          grammar: item.title,
          groupId,
        });
      }
    });
  });
  return questions;
}

function generateRandomQuiz() {
  return [
    { id: "r1", question: "雨が降る＿＿だ。\nIt looks like it will rain.", options: ["みたい", "らしい", "っぽい", "ように"], correct: 0, grammar: "〜みたい", groupId: null },
    { id: "r2", question: "明日は雨＿＿。\nApparently it will rain tomorrow.", options: ["みたいだ", "らしい", "っぽい", "ようだ"], correct: 1, grammar: "〜らしい", groupId: null },
    { id: "r3", question: "彼は怒り＿＿。\nHe tends to get angry easily.", options: ["みたい", "らしい", "っぽい", "ようだ"], correct: 2, grammar: "〜っぽい", groupId: null },
    { id: "r4", question: "日本語が話せる＿＿なった。\nI became able to speak Japanese.", options: ["ように", "みたいに", "らしく", "っぽく"], correct: 0, grammar: "〜ようになる", groupId: null },
    { id: "r5", question: "毎日運動する＿＿しています。\nI make an effort to exercise daily.", options: ["ために", "ように", "みたいに", "らしく"], correct: 1, grammar: "〜ようにする", groupId: null },
    { id: "r6", question: "試験に受かり＿＿。\nI hope I pass the exam.", options: ["ますように", "たいです", "みたいです", "らしいです"], correct: 0, grammar: "〜ように (Hope)", groupId: null },
  ];
}

// ─── Color Tokens ────────────────────────────────────────────────
const C = {
  bg: "#F7F3EE",
  surface: "#FFFFFF",
  dark: "#2C2420",
  darkAlt: "#4A3728",
  gold: "#C4A882",
  goldLight: "#F0E8DD",
  text: "#2C2420",
  textMid: "#7A6B5D",
  textLight: "#8B7355",
  textMuted: "#A89580",
  green: "#5A8F5A",
  greenBg: "#EAF4EA",
  red: "#C25B4E",
  redBg: "#FAEAE8",
  border: "rgba(196,168,130,0.15)",
  borderMid: "rgba(196,168,130,0.25)",
  borderLight: "rgba(196,168,130,0.3)",
};

// ─── Shared Styles ───────────────────────────────────────────────
const S = {
  card: {
    background: C.surface, borderRadius: "14px", padding: "20px",
    marginBottom: "14px", boxShadow: "0 1px 8px rgba(44,36,32,0.06)",
    border: `1px solid ${C.border}`,
  },
  tag: (bg = C.goldLight, color = C.textLight) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: "20px",
    fontSize: "11px", fontWeight: 500, background: bg, color, marginRight: "6px", marginBottom: "6px",
  }),
  sectionTitle: {
    fontSize: "13px", fontWeight: 600, color: C.textMuted,
    textTransform: "uppercase", letterSpacing: "1.5px", margin: "16px 0 8px",
  },
  btn: (bg, color) => ({
    padding: "10px 24px", borderRadius: "10px", border: "none",
    fontSize: "14px", fontWeight: 600, cursor: "pointer",
    fontFamily: "'Noto Sans JP', sans-serif", background: bg, color,
  }),
};

// ═══════════════════════════════════════════════════════════════════
// COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════
function ComparisonTable({ groupId }) {
  const items = grammarData.filter(g => g.groupId === groupId);
  const group = grammarGroups.find(g => g.id === groupId);
  if (!items.length) return null;

  const rows = [
    { label: "Verb", key: "verb" },
    { label: "いadj", key: "iAdj" },
    { label: "なadj", key: "naAdj" },
    { label: "Noun", key: "noun" },
    { label: "Nuance", key: "nuance" },
  ];

  const headerColors = ["#E8D5BC", "#D4C4A8", "#C4B498", "#B4A488", "#A89478"];

  return (
    <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${C.border}`, background: "linear-gradient(135deg, #FAF7F3, #F5EFE6)" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: C.gold, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 4px" }}>
          Comparison · Week {group?.week} Day {group?.day}
        </p>
        <p style={{ fontSize: "16px", fontWeight: 700, color: C.dark, margin: 0 }}>{group?.label}</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={{ padding: "12px 14px", textAlign: "left", background: "#F5EFE6", color: C.textMid, fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${C.gold}`, position: "sticky", left: 0, zIndex: 2, minWidth: "60px" }}>
                Form
              </th>
              {items.map((item, i) => (
                <th key={item.id} style={{
                  padding: "12px 14px", textAlign: "center",
                  background: `linear-gradient(180deg, ${headerColors[i % headerColors.length]}22, ${headerColors[i % headerColors.length]}11)`,
                  color: C.dark, fontWeight: 700, fontSize: "15px",
                  borderBottom: `2px solid ${C.gold}`, minWidth: "120px",
                }}>
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.key} style={{ background: ri % 2 === 0 ? "#FDFBF8" : C.surface }}>
                <td style={{
                  padding: "12px 14px", fontWeight: 600, color: C.textLight,
                  fontSize: "12px", borderBottom: `1px solid ${C.border}`,
                  position: "sticky", left: 0, zIndex: 1,
                  background: ri % 2 === 0 ? "#FDFBF8" : C.surface,
                }}>
                  {row.label}
                </td>
                {items.map(item => {
                  const val = row.key === "nuance" ? item.nuance : item.formation?.[row.key];
                  const isEmpty = !val || val === "—";
                  return (
                    <td key={item.id} style={{
                      padding: "12px 14px", textAlign: "center",
                      borderBottom: `1px solid ${C.border}`,
                      color: isEmpty ? C.textMuted : row.key === "nuance" ? C.textMid : C.dark,
                      fontWeight: row.key === "nuance" ? 400 : 500,
                      fontStyle: row.key === "nuance" ? "italic" : "normal",
                      fontSize: row.key === "nuance" ? "12px" : "13px",
                      lineHeight: 1.5,
                    }}>
                      {isEmpty ? "—" : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Example row below table */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: "#FAF7F3" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Key Examples</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {items.map(item => (
            <div key={item.id} style={{ flex: "1 1 150px", borderLeft: `3px solid ${C.gold}`, paddingLeft: "10px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: C.gold, margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ fontSize: "14px", color: C.dark, margin: "0 0 2px" }}>{item.examples[0]?.jp}</p>
              <p style={{ fontSize: "11px", color: C.textMid, margin: 0, fontStyle: "italic" }}>{item.examples[0]?.en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GRAMMAR REFERENCE
// ═══════════════════════════════════════════════════════════════════
function GrammarReference() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("compare"); // "compare" or "list"
  const [selectedDay, setSelectedDay] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const days = [...new Set(grammarData.map(g => g.day))].sort();

  const filtered = grammarData.filter(g => {
    const matchSearch = !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.meaning.toLowerCase().includes(search.toLowerCase());
    const matchDay = selectedDay === null || g.day === selectedDay;
    return matchSearch && matchDay;
  });

  const filteredGroups = grammarGroups.filter(grp => {
    if (selectedDay !== null && grp.day !== selectedDay) return false;
    if (!search) return true;
    const items = grammarData.filter(g => g.groupId === grp.id);
    return items.some(g =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.meaning.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <div style={{ position: "relative", marginBottom: "4px" }}>
        <span style={{ position: "absolute", left: "16px", top: "14px", fontSize: "18px", opacity: 0.4 }}>🔍</span>
        <input
          style={{
            width: "100%", padding: "14px 18px 14px 44px",
            border: `2px solid ${C.borderLight}`, borderRadius: "12px",
            fontSize: "15px", background: C.surface, outline: "none",
            fontFamily: "'Noto Sans JP', sans-serif", color: C.dark,
            boxSizing: "border-box", marginBottom: "12px",
          }}
          placeholder="Search grammar points..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* View mode toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          onClick={() => setViewMode("compare")}
          style={{
            ...S.btn(viewMode === "compare" ? C.dark : "transparent", viewMode === "compare" ? C.bg : C.textLight),
            border: viewMode === "compare" ? "none" : `1px solid ${C.borderMid}`,
            padding: "8px 16px", fontSize: "13px",
          }}
        >
          ⚖ Compare View
        </button>
        <button
          onClick={() => setViewMode("list")}
          style={{
            ...S.btn(viewMode === "list" ? C.dark : "transparent", viewMode === "list" ? C.bg : C.textLight),
            border: viewMode === "list" ? "none" : `1px solid ${C.borderMid}`,
            padding: "8px 16px", fontSize: "13px",
          }}
        >
          ☰ List View
        </button>
      </div>

      {/* Day filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button
          style={{
            padding: "8px 16px", borderRadius: "20px",
            border: selectedDay === null ? `2px solid ${C.gold}` : `2px solid ${C.borderMid}`,
            background: selectedDay === null ? C.gold : "transparent",
            color: selectedDay === null ? C.dark : C.textLight,
            fontSize: "13px", fontWeight: 500, cursor: "pointer",
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
          onClick={() => setSelectedDay(null)}
        >All Days</button>
        {days.map(d => (
          <button key={d}
            style={{
              padding: "8px 16px", borderRadius: "20px",
              border: selectedDay === d ? `2px solid ${C.gold}` : `2px solid ${C.borderMid}`,
              background: selectedDay === d ? C.gold : "transparent",
              color: selectedDay === d ? C.dark : C.textLight,
              fontSize: "13px", fontWeight: 500, cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
            onClick={() => setSelectedDay(d)}
          >Day {d}</button>
        ))}
      </div>

      {/* COMPARE VIEW */}
      {viewMode === "compare" && (
        <div>
          {filteredGroups.map(grp => (
            <ComparisonTable key={grp.id} groupId={grp.id} />
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && filtered.map(g => (
        <div key={g.id}
          style={{ ...S.card, cursor: "pointer", ...(expanded === g.id ? { boxShadow: "0 4px 20px rgba(44,36,32,0.1)" } : {}) }}
          onClick={() => setExpanded(expanded === g.id ? null : g.id)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 700, color: C.dark, margin: "0 0 4px" }}>{g.title}</p>
              <p style={{ fontSize: "14px", color: C.textMid, margin: "0 0 14px", lineHeight: 1.5 }}>{g.meaning}</p>
            </div>
            <span style={{ fontSize: "20px", color: C.gold, transform: expanded === g.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }}>▾</span>
          </div>
          <div>
            <span style={S.tag(C.gold, C.dark)}>Week {g.week}</span>
            <span style={S.tag()}>Day {g.day}</span>
            <span style={S.tag("#E8E0D4", C.textMid)}>{grammarGroups.find(gr => gr.id === g.groupId)?.label.split("·")[0]?.trim()}</span>
          </div>
          {expanded === g.id && (
            <div style={{ marginTop: "16px" }}>
              <p style={S.sectionTitle}>Formation</p>
              {g.formationList.map((f, i) => (
                <div key={i} style={{ fontSize: "14px", color: C.darkAlt, padding: "6px 0", borderBottom: `1px dashed ${C.borderLight}`, lineHeight: 1.5 }}>{f}</div>
              ))}
              <p style={S.sectionTitle}>Examples</p>
              {g.examples.map((ex, i) => (
                <div key={i} style={{ background: "#FAF7F3", borderRadius: "10px", padding: "12px 14px", marginBottom: "8px", borderLeft: `3px solid ${C.gold}` }}>
                  <p style={{ fontSize: "16px", fontWeight: 500, color: C.dark, margin: "0 0 4px" }}>{ex.jp}</p>
                  <p style={{ fontSize: "13px", color: C.textLight, margin: 0, fontStyle: "italic" }}>{ex.en}</p>
                </div>
              ))}
              {g.notes && (
                <>
                  <p style={S.sectionTitle}>Notes</p>
                  <p style={{ fontSize: "14px", color: C.textMid, lineHeight: 1.6, margin: 0 }}>{g.notes}</p>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUIZ with Mode Selection
// ═══════════════════════════════════════════════════════════════════
function Quiz() {
  const [mode, setMode] = useState(null); // null = choosing, "group" | "random"
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const startGroupQuiz = (groupId) => {
    setSelectedGroup(groupId);
    const qs = generateGroupQuiz(groupId);
    setQuestions(qs.length > 0 ? qs : generateRandomQuiz());
    setMode("group");
    setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); setAnswers([]);
  };

  const startRandomQuiz = () => {
    setQuestions(generateRandomQuiz());
    setMode("random");
    setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); setAnswers([]);
  };

  const resetQuiz = () => {
    setMode(null); setSelectedGroup(null); setQuestions([]);
    setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); setAnswers([]);
  };

  // ── Mode Selection Screen ──
  if (mode === null) {
    return (
      <div>
        <div style={{ ...S.card, textAlign: "center", padding: "28px 20px", background: "linear-gradient(135deg, #2C2420 0%, #4A3728 100%)", color: C.bg }}>
          <p style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px" }}>Choose Quiz Mode</p>
          <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>Test your grammar knowledge</p>
        </div>

        {/* Group Quiz */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <span style={{ fontSize: "24px" }}>⚖</span>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: 0 }}>Similar Patterns Quiz</p>
              <p style={{ fontSize: "13px", color: C.textMid, margin: "2px 0 0" }}>
                Test with grammar from the same group — wrong answers are always similar patterns
              </p>
            </div>
          </div>
          {grammarGroups.map(grp => {
            const count = grammarData.filter(g => g.groupId === grp.id).length;
            return (
              <button key={grp.id}
                onClick={() => startGroupQuiz(grp.id)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  width: "100%", padding: "14px 16px", marginBottom: "8px",
                  borderRadius: "10px", border: `1px solid ${C.borderMid}`,
                  background: "#FAF7F3", cursor: "pointer", textAlign: "left",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: C.dark, margin: 0 }}>{grp.label}</p>
                  <p style={{ fontSize: "12px", color: C.textMid, margin: "2px 0 0" }}>Week {grp.week} · Day {grp.day}</p>
                </div>
                <span style={{ fontSize: "12px", color: C.textLight, background: C.goldLight, padding: "4px 10px", borderRadius: "12px" }}>
                  {count} patterns
                </span>
              </button>
            );
          })}
        </div>

        {/* Random Quiz */}
        <div style={{ ...S.card, cursor: "pointer" }} onClick={startRandomQuiz}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🎲</span>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: 0 }}>Mixed Quiz</p>
              <p style={{ fontSize: "13px", color: C.textMid, margin: "2px 0 0" }}>
                Random questions across all grammar points
              </p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: "20px", color: C.gold }}>→</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz Active / Finished ──
  const q = questions[currentQ];
  const progress = ((currentQ + (selected !== null ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === q.correct;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { qId: q.id, correct: isCorrect }]);
  };

  const next = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ ...S.card, textAlign: "center", padding: "40px 24px" }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>
          {pct >= 80 ? "🎉" : pct >= 50 ? "📚" : "💪"}
        </div>
        <p style={{ fontSize: "32px", fontWeight: 700, color: C.dark, margin: "0 0 4px" }}>
          {score}/{questions.length}
        </p>
        <p style={{ fontSize: "14px", color: C.textLight, margin: "0 0 6px" }}>
          {mode === "group" ? grammarGroups.find(g => g.id === selectedGroup)?.label : "Mixed Quiz"}
        </p>
        <p style={{ fontSize: "14px", color: C.textMid, margin: "0 0 24px" }}>
          {pct >= 80 ? "Excellent!" : pct >= 50 ? "Good effort, keep studying!" : "Keep practicing!"}
        </p>
        <div style={{ marginBottom: "24px" }}>
          {answers.map((a, i) => (
            <span key={i} style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: a.correct ? C.green : C.red, margin: "0 4px" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={resetQuiz} style={S.btn(C.goldLight, C.textLight)}>← Back to Modes</button>
          <button onClick={() => { setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); setAnswers([]); }} style={S.btn(C.dark, C.bg)}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!q) return <p>No questions available for this group yet.</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <button onClick={resetQuiz} style={{ background: "none", border: "none", color: C.textLight, fontSize: "13px", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", padding: 0 }}>
          ← Modes
        </button>
        <span style={{ fontSize: "13px", color: C.textLight }}>
          {mode === "group" ? "⚖ Similar" : "🎲 Mixed"} · Q{currentQ + 1}/{questions.length} · {score} correct
        </span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "#EDE6DC", overflow: "hidden", marginBottom: "20px" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.textLight})`, borderRadius: "3px", transition: "width 0.4s ease" }} />
      </div>

      <div style={S.card}>
        <span style={S.tag()}>{q.grammar}</span>
        <p style={{ fontSize: "18px", fontWeight: 600, color: C.dark, margin: "12px 0 20px", lineHeight: 1.6, whiteSpace: "pre-line" }}>
          {q.question}
        </p>
        {q.options.map((opt, i) => {
          let state = "unanswered";
          if (selected !== null) {
            if (i === q.correct) state = "correct";
            else if (i === selected) state = "wrong";
          }
          return (
            <button key={i}
              onClick={() => handleSelect(i)}
              style={{
                display: "block", width: "100%", padding: "16px 18px", marginBottom: "10px",
                borderRadius: "12px", fontSize: "16px", textAlign: "left",
                fontFamily: "'Noto Sans JP', sans-serif", color: C.dark,
                cursor: state === "unanswered" ? "pointer" : "default",
                border: state === "correct" ? `2px solid ${C.green}` : state === "wrong" ? `2px solid ${C.red}` : `2px solid ${C.borderMid}`,
                background: state === "correct" ? C.greenBg : state === "wrong" ? C.redBg : C.surface,
                fontWeight: state === "correct" ? 600 : 400,
                boxSizing: "border-box",
              }}
            >{opt}</button>
          );
        })}
        {selected !== null && (
          <div style={{ textAlign: "right", marginTop: "8px" }}>
            <button onClick={next} style={S.btn(C.dark, C.bg)}>
              {currentQ < questions.length - 1 ? "Next →" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Marking Categories ──────────────────────────────────────────
const MARKING = {
  0: { label: "Not Marked", icon: "○", bg: "#9CA3AF", lightBg: "#F3F4F6", text: "#374151", border: "#D1D5DB" },
  1: { label: "Monthly Review", icon: "✓", bg: "#10B981", lightBg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  2: { label: "Can't Converse", icon: "💬", bg: "#8B5CF6", lightBg: "#EDE9FE", text: "#5B21B6", border: "#A78BFA" },
  3: { label: "Can't Write", icon: "✍", bg: "#F97316", lightBg: "#FFEDD5", text: "#9A3412", border: "#FDBA74" },
  4: { label: "Can't Use", icon: "🤔", bg: "#EC4899", lightBg: "#FCE7F3", text: "#9D174D", border: "#F9A8D4" },
  5: { label: "Don't Know", icon: "❌", bg: "#EF4444", lightBg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
};

// ═══════════════════════════════════════════════════════════════════
// FLASHCARDS with Progressive Reveal & 6 Categories
// ═══════════════════════════════════════════════════════════════════
function Flashcards() {
  const [deckMode, setDeckMode] = useState(null);
  const [current, setCurrent] = useState(0);
  const [revealStep, setRevealStep] = useState(0); // 0 = front only, 1+ = progressive hints
  const [stats, setStats] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [showMarkPanel, setShowMarkPanel] = useState(false);

  const getDeck = () => {
    if (!deckMode) return [];
    if (deckMode === "all") return grammarData;
    if (deckMode === "conjunctions") return conjunctions.map((c, i) => ({ id: 100 + i, title: c.kana, meaning: c.meaning, kanji: c.kanji, type: "conjunction" }));
    if (deckMode.startsWith("group:")) {
      const gId = deckMode.split(":")[1];
      return grammarData.filter(g => g.groupId === gId);
    }
    return grammarData;
  };

  const deck = getDeck();
  const card = deck[current];

  // Build hints array based on card type
  const getHints = (c) => {
    if (!c) return [];
    const isGrammar = !c.type;
    if (!isGrammar) {
      // Conjunction card: meaning is the only hint
      return [
        { label: "Meaning", content: c.meaning },
      ];
    }
    const hints = [
      { label: "Meaning", content: c.meaning },
    ];
    if (c.nuance) hints.push({ label: "Nuance", content: c.nuance });
    if (c.formationList?.length) hints.push({ label: "Formation", content: c.formationList.join("\n") });
    if (c.examples?.[0]) hints.push({ label: "Example (JP)", content: c.examples[0].jp });
    if (c.examples?.[0]) hints.push({ label: "Example (EN)", content: c.examples[0].en });
    if (c.examples?.[1]) hints.push({ label: "Example 2 (JP)", content: c.examples[1].jp });
    if (c.examples?.[1]) hints.push({ label: "Example 2 (EN)", content: c.examples[1].en });
    if (c.notes) hints.push({ label: "Notes", content: c.notes });
    return hints;
  };

  const hints = getHints(card);
  const totalHints = hints.length;
  const allRevealed = revealStep >= totalHints;

  const revealNext = () => {
    if (revealStep < totalHints) {
      setRevealStep(revealStep + 1);
    }
  };

  const markCard = (level) => {
    setStats({ ...stats, [level]: stats[level] + 1 });
    setRevealStep(0);
    setShowMarkPanel(false);
    setTimeout(() => {
      setCurrent(current < deck.length - 1 ? current + 1 : 0);
    }, 150);
  };

  const resetDeck = () => {
    setDeckMode(null); setCurrent(0); setRevealStep(0); setShowMarkPanel(false);
    setStats({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  };

  // ── Deck Selection ──
  if (deckMode === null) {
    return (
      <div>
        <div style={{ ...S.card, textAlign: "center", padding: "28px 20px", background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkAlt} 100%)`, color: C.bg }}>
          <p style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px" }}>Choose Deck</p>
          <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>Study flashcards by group or all at once</p>
        </div>

        <p style={{ ...S.sectionTitle, marginTop: "20px" }}>By Grammar Group</p>
        {grammarGroups.map(grp => {
          const count = grammarData.filter(g => g.groupId === grp.id).length;
          return (
            <div key={grp.id} style={{ ...S.card, cursor: "pointer", padding: "16px 18px" }} onClick={() => setDeckMode(`group:${grp.id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: C.dark, margin: 0 }}>{grp.label}</p>
                  <p style={{ fontSize: "12px", color: C.textMid, margin: "2px 0 0" }}>Week {grp.week} · Day {grp.day}</p>
                </div>
                <span style={{ fontSize: "12px", color: C.textLight, background: C.goldLight, padding: "4px 10px", borderRadius: "12px" }}>{count} cards</span>
              </div>
            </div>
          );
        })}

        <p style={{ ...S.sectionTitle, marginTop: "20px" }}>Full Decks</p>
        <div style={{ ...S.card, cursor: "pointer", padding: "16px 18px" }} onClick={() => setDeckMode("all")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: C.dark, margin: 0 }}>All Grammar Points</p>
            <span style={{ fontSize: "12px", color: C.textLight, background: C.goldLight, padding: "4px 10px", borderRadius: "12px" }}>{grammarData.length} cards</span>
          </div>
        </div>
        <div style={{ ...S.card, cursor: "pointer", padding: "16px 18px" }} onClick={() => setDeckMode("conjunctions")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: C.dark, margin: 0 }}>Conjunctions (接続詞)</p>
            <span style={{ fontSize: "12px", color: C.textLight, background: C.goldLight, padding: "4px 10px", borderRadius: "12px" }}>{conjunctions.length} cards</span>
          </div>
        </div>
      </div>
    );
  }

  if (!card) return null;
  const isGrammar = !card.type;
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button onClick={resetDeck} style={{ background: "none", border: "none", color: C.textLight, fontSize: "13px", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", padding: 0 }}>
          ← Decks
        </button>
        <span style={{ fontSize: "13px", color: C.textLight }}>
          Card {current + 1} / {deck.length}
        </span>
      </div>

      {/* Stats mini-bar */}
      {total > 0 && (
        <div style={{ display: "flex", gap: "4px", marginBottom: "14px", flexWrap: "wrap" }}>
          {Object.entries(MARKING).map(([k, m]) => {
            const count = stats[k];
            if (count === 0) return null;
            return (
              <span key={k} style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                background: m.lightBg, color: m.text, border: `1px solid ${m.border}`,
              }}>
                {m.icon} {count}
              </span>
            );
          })}
        </div>
      )}

      {/* ── Card Front ── */}
      <div style={{
        ...S.card, padding: "28px 24px", textAlign: "center",
        background: revealStep === 0
          ? C.surface
          : `linear-gradient(180deg, ${C.surface} 0%, #FAF7F3 100%)`,
        border: `2px solid ${revealStep > 0 ? C.gold : C.borderLight}`,
        transition: "all 0.3s ease",
      }}>
        {/* Title area - always visible */}
        {isGrammar && <span style={{ ...S.tag(C.gold, C.dark), marginBottom: "12px" }}>Week {card.week} · Day {card.day}</span>}
        {!isGrammar && <span style={{ ...S.tag(), marginBottom: "12px" }}>Conjunction</span>}
        <p style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 4px", color: C.dark }}>{card.title}</p>
        {card.kanji && <p style={{ fontSize: "16px", color: C.textLight, margin: "0 0 8px" }}>{card.kanji}</p>}

        {/* Hint progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", margin: "16px 0" }}>
          {hints.map((_, i) => (
            <div key={i} style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: i < revealStep ? C.gold : "#E0D8CE",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>

        {/* Progressive hints */}
        {revealStep > 0 && (
          <div style={{ textAlign: "left", width: "100%", marginTop: "8px" }}>
            {hints.slice(0, revealStep).map((hint, i) => (
              <div key={i} style={{
                background: i === revealStep - 1 ? C.goldLight : "#FAF7F3",
                borderRadius: "10px", padding: "12px 14px", marginBottom: "8px",
                borderLeft: `3px solid ${i === revealStep - 1 ? C.gold : "#D4C9BA"}`,
                animation: i === revealStep - 1 ? "fadeIn 0.3s ease" : "none",
              }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>
                  {hint.label}
                </p>
                <p style={{
                  fontSize: hint.label.includes("Example") ? "16px" : "14px",
                  fontWeight: hint.label === "Meaning" ? 600 : 400,
                  color: C.dark, margin: 0, lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  fontStyle: hint.label.includes("EN") || hint.label === "Nuance" ? "italic" : "normal",
                }}>
                  {hint.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Reveal next hint button */}
        {!allRevealed && (
          <button
            onClick={revealNext}
            style={{
              marginTop: "12px", padding: "12px 32px", borderRadius: "12px",
              border: `2px solid ${C.gold}`, background: revealStep === 0 ? C.gold : "transparent",
              color: revealStep === 0 ? C.dark : C.gold,
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
              transition: "all 0.2s ease",
            }}
          >
            {revealStep === 0 ? "Reveal Hint" : `Next Hint (${revealStep}/${totalHints})`}
          </button>
        )}

        {/* Show all remaining button */}
        {revealStep > 0 && !allRevealed && (
          <button
            onClick={() => setRevealStep(totalHints)}
            style={{
              marginTop: "8px", marginLeft: "8px", padding: "12px 24px", borderRadius: "12px",
              border: "none", background: C.dark, color: C.bg,
              fontSize: "13px", fontWeight: 500, cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            Show All
          </button>
        )}
      </div>

      {/* ── Mark Button ── */}
      {revealStep > 0 && (
        <div style={{ marginTop: "4px" }}>
          {!showMarkPanel ? (
            <button
              onClick={() => setShowMarkPanel(true)}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                border: `2px solid ${C.borderMid}`, background: C.surface,
                fontSize: "14px", fontWeight: 600, cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif", color: C.dark,
                transition: "all 0.2s ease",
              }}
            >
              Mark & Next →
            </button>
          ) : (
            <div style={{ ...S.card, padding: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px", textAlign: "center" }}>
                How well do you know this?
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {Object.entries(MARKING).map(([k, m]) => (
                  <button key={k}
                    onClick={() => markCard(Number(k))}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "12px 14px", borderRadius: "10px",
                      border: `2px solid ${m.border}`, background: m.lightBg,
                      cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: m.bg, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", flexShrink: 0,
                    }}>
                      {m.icon}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: m.text, textAlign: "left", lineHeight: 1.3 }}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════
function Progress() {
  const weekData = [
    { week: 1, label: "みたい・らしい・ように", progress: 75 },
    { week: 2, label: "ばかり・さえ・こそ・に関して", progress: 30 },
    { week: 3, label: "とおり・まま・っぱなし", progress: 0 },
    { week: 4, label: "ところ・うちに・ことだ", progress: 0 },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {[
          { val: "8", label: "Points Studied", color: C.gold },
          { val: "67%", label: "Quiz Accuracy", color: C.green },
          { val: "3", label: "Needs Review", color: C.red },
        ].map((s, i) => (
          <div key={i} style={S.card}>
            <p style={{ fontSize: "36px", fontWeight: 700, color: s.color, margin: "0 0 4px" }}>{s.val}</p>
            <p style={{ fontSize: "12px", color: C.textLight, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: "0 0 16px" }}>Weekly Progress</p>
        {weekData.map(w => (
          <div key={w.week} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ minWidth: "60px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.dark }}>Week {w.week}</span>
            </div>
            <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "#EDE6DC", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${w.progress}%`, background: w.progress === 100 ? C.green : `linear-gradient(90deg, ${C.gold}, ${C.textLight})`, borderRadius: "4px", transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 500, color: C.textLight, minWidth: "36px", textAlign: "right" }}>{w.progress}%</span>
          </div>
        ))}
      </div>

      {/* Group Mastery */}
      <div style={S.card}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: "0 0 12px" }}>Group Mastery</p>
        {grammarGroups.map(grp => {
          const items = grammarData.filter(g => g.groupId === grp.id);
          return (
            <div key={grp.id} style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: C.textLight, margin: "0 0 8px" }}>{grp.label}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {items.map(g => {
                  // Simulated marks for prototype
                  const markLevel = g.id <= 2 ? 1 : g.id <= 4 ? 2 : g.id <= 6 ? 4 : 0;
                  const m = MARKING[markLevel];
                  return (
                    <span key={g.id} style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                      background: m.lightBg, border: `1px solid ${m.border}`, color: m.text,
                    }}>
                      <span style={{ fontSize: "12px" }}>{m.icon}</span> {g.title}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap", fontSize: "11px" }}>
          {Object.entries(MARKING).map(([k, m]) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: "3px", color: m.text }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: m.bg, display: "inline-block" }} />
              {m.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ ...S.card, background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkAlt} 100%)`, color: C.bg }}>
        <p style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 8px" }}>Study Streak</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 600,
              background: i < 5 ? C.gold : `rgba(196,168,130,0.2)`,
              color: i < 5 ? C.dark : C.textLight,
            }}>{d}</div>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>5 day streak! Keep it going</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("grammar");

  const tabs = [
    { id: "grammar", label: "文法", sub: "Grammar" },
    { id: "quiz", label: "問題", sub: "Quiz" },
    { id: "cards", label: "カード", sub: "Cards" },
    { id: "progress", label: "進捗", sub: "Stats" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Noto Sans JP', 'Helvetica Neue', sans-serif", color: C.dark }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:active { transform: scale(0.97); }
        input::placeholder { color: #B0A090; }
        input:focus { border-color: ${C.gold} !important; }
      `}</style>

      <header style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkAlt} 100%)`,
        padding: "20px 24px 16px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(44,36,32,0.15)",
      }}>
        <p style={{ fontSize: "22px", fontWeight: 700, color: C.bg, margin: 0, letterSpacing: "0.5px" }}>N3 文法マスター</p>
        <p style={{ fontSize: "11px", color: C.gold, margin: "2px 0 0", letterSpacing: "2px", textTransform: "uppercase" }}>JLPT Grammar Study</p>
        <nav style={{ display: "flex", gap: "2px", background: "#3A2D24", padding: "4px", borderRadius: "12px", marginTop: "14px" }}>
          {tabs.map(t => (
            <button key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "10px 8px", border: "none", borderRadius: "10px",
                fontSize: "12px", fontWeight: tab === t.id ? 600 : 400, cursor: "pointer",
                transition: "all 0.25s ease",
                background: tab === t.id ? C.gold : "transparent",
                color: tab === t.id ? C.dark : C.textMuted,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              <div style={{ fontSize: "14px" }}>{t.label}</div>
              <div style={{ fontSize: "10px", marginTop: "2px", opacity: 0.8 }}>{t.sub}</div>
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: "20px 16px 100px", maxWidth: "640px", margin: "0 auto" }}>
        {tab === "grammar" && <GrammarReference />}
        {tab === "quiz" && <Quiz />}
        {tab === "cards" && <Flashcards />}
        {tab === "progress" && <Progress />}
      </main>
    </div>
  );
}
