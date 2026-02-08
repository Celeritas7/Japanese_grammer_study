import { useState } from 'react';
import { useGrammarPoints, useGrammarGroups, useQuizQuestions } from '../hooks/useGrammar';
import { useQuizResults, useStreak } from '../hooks/useProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { C, S } from '../lib/styles';

export default function QuizPage() {
  const { data: grammarData, loading: grammarLoading } = useGrammarPoints();
  const { groups: grammarGroups, loading: groupsLoading } = useGrammarGroups();
  const { data: allQuizQuestions, loading: quizLoading } = useQuizQuestions();
  const { saveResult } = useQuizResults();
  const { recordStudy } = useStreak();

  const [mode, setMode] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  if (grammarLoading || groupsLoading || quizLoading) return <LoadingSpinner message="Loading quiz..." />;

  // Generate group quiz from grammar data (pattern-based)
  const generateGroupQuiz = (groupId) => {
    const items = grammarData.filter(g => g.group_id === groupId);
    if (items.length < 2) return [];
    const qs = [];
    items.forEach(item => {
      (item.examples || []).forEach(ex => {
        const pattern = item.title.replace(/[〜～]/g, "");
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const blanked = ex.jp.replace(new RegExp(escaped), "＿＿");
        if (blanked !== ex.jp) {
          const opts = items.map(i => i.title.replace(/[〜～]/g, ""));
          const correctIdx = opts.indexOf(pattern);
          qs.push({
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
    return qs;
  };

  // Get stored quiz questions as fallback / mixed quiz
  const getStoredQuestions = (groupId = null) => {
    let qs = allQuizQuestions;
    if (groupId) qs = qs.filter(q => q.group_id === groupId);
    return qs.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct: q.correct_index,
      grammar: "",
      groupId: q.group_id,
    }));
  };

  const startGroupQuiz = (groupId) => {
    setSelectedGroup(groupId);
    let qs = generateGroupQuiz(groupId);
    if (qs.length === 0) qs = getStoredQuestions(groupId);
    if (qs.length === 0) qs = getStoredQuestions(); // fallback to all
    setQuestions(qs);
    setMode("group");
    setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); setAnswers([]);
  };

  const startRandomQuiz = () => {
    let qs = getStoredQuestions();
    if (qs.length === 0) {
      // Generate from all groups
      grammarGroups.forEach(grp => {
        qs = [...qs, ...generateGroupQuiz(grp.id)];
      });
    }
    // Shuffle
    qs = qs.sort(() => Math.random() - 0.5);
    setQuestions(qs);
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
        <div style={{ ...S.card, textAlign: "center", padding: "28px 20px", background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkAlt} 100%)`, color: C.bg }}>
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
            const count = grammarData.filter(g => g.group_id === grp.id).length;
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
      // Save result to Supabase
      saveResult({
        quizMode: mode,
        groupId: selectedGroup,
        totalQuestions: questions.length,
        correctAnswers: score + (selected === q.correct ? 0 : 0), // score already updated
        answers,
      });
      recordStudy('quiz');
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

  if (!q) return <p style={{ textAlign: "center", color: C.textMid, padding: "40px" }}>No questions available for this group yet.</p>;

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
        {q.grammar && <span style={S.tag()}>{q.grammar}</span>}
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
