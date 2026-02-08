import { useEffect } from 'react';
import { useGrammarPoints, useGrammarGroups } from '../hooks/useGrammar';
import { useCardMarks } from '../hooks/useCardMarks';
import { useQuizResults, useStreak } from '../hooks/useProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { MARKING } from '../lib/constants';
import { C, S } from '../lib/styles';

export default function ProgressPage() {
  const { data: grammarData, loading: grammarLoading } = useGrammarPoints();
  const { groups: grammarGroups } = useGrammarGroups();
  const { marks, getStats, loading: marksLoading, getMarkLevel } = useCardMarks();
  const { history, fetchHistory, loading: historyLoading } = useQuizResults();
  const { streak, weekDays, fetchStreak } = useStreak();

  useEffect(() => {
    fetchHistory();
    fetchStreak();
  }, [fetchHistory, fetchStreak]);

  if (grammarLoading || marksLoading) return <LoadingSpinner message="Loading stats..." />;

  const stats = getStats();
  const totalMarked = Object.values(stats).reduce((a, b) => a + b, 0);
  const needsReview = (stats[2] || 0) + (stats[3] || 0) + (stats[4] || 0) + (stats[5] || 0);

  // Calculate quiz accuracy
  let quizAccuracy = 0;
  if (history.length > 0) {
    const totalCorrect = history.reduce((sum, h) => sum + h.correct_answers, 0);
    const totalQuestions = history.reduce((sum, h) => sum + h.total_questions, 0);
    quizAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  }

  // Calculate weekly progress
  const weekNumbers = [...new Set(grammarData.map(g => g.week))].sort();
  const weekProgress = weekNumbers.map(w => {
    const weekItems = grammarData.filter(g => g.week === w);
    const markedItems = weekItems.filter(g => {
      const ml = getMarkLevel("grammar", g.id);
      return ml !== null && ml !== undefined;
    });
    const progress = weekItems.length > 0 ? Math.round((markedItems.length / weekItems.length) * 100) : 0;
    const labels = [...new Set(weekItems.map(g => {
      const grp = grammarGroups.find(gr => gr.id === g.group_id);
      return grp?.label?.split("·")[0]?.trim() || g.title;
    }))].join(" · ");
    return { week: w, label: labels, progress };
  });

  return (
    <div>
      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {[
          { val: String(totalMarked || grammarData.length), label: "Points Studied", color: C.gold },
          { val: history.length > 0 ? `${quizAccuracy}%` : "—", label: "Quiz Accuracy", color: C.green },
          { val: String(needsReview), label: "Needs Review", color: C.red },
        ].map((s, i) => (
          <div key={i} style={S.card}>
            <p style={{ fontSize: "36px", fontWeight: 700, color: s.color, margin: "0 0 4px" }}>{s.val}</p>
            <p style={{ fontSize: "12px", color: C.textLight, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly Progress */}
      <div style={S.card}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: "0 0 16px" }}>Weekly Progress</p>
        {weekProgress.map(w => (
          <div key={w.week} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ minWidth: "60px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.dark }}>Week {w.week}</span>
            </div>
            <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "#EDE6DC", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${w.progress}%`,
                background: w.progress === 100 ? C.green : `linear-gradient(90deg, ${C.gold}, ${C.textLight})`,
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 500, color: C.textLight, minWidth: "36px", textAlign: "right" }}>{w.progress}%</span>
          </div>
        ))}
        {weekProgress.length === 0 && (
          <p style={{ fontSize: "13px", color: C.textMid, textAlign: "center", padding: "16px 0" }}>No data yet — start studying!</p>
        )}
      </div>

      {/* Group Mastery */}
      <div style={S.card}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: "0 0 12px" }}>Group Mastery</p>
        {grammarGroups.map(grp => {
          const items = grammarData.filter(g => g.group_id === grp.id);
          return (
            <div key={grp.id} style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: C.textLight, margin: "0 0 8px" }}>{grp.label}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {items.map(g => {
                  const markLevel = getMarkLevel("grammar", g.id) ?? 0;
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
        {/* Legend */}
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap", fontSize: "11px" }}>
          {Object.entries(MARKING).map(([k, m]) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: "3px", color: m.text }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: m.bg, display: "inline-block" }} />
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Quiz History */}
      {history.length > 0 && (
        <div style={S.card}>
          <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: "0 0 12px" }}>Recent Quizzes</p>
          {history.slice(0, 5).map((h, i) => {
            const pct = Math.round((h.correct_answers / h.total_questions) * 100);
            return (
              <div key={h.id || i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0", borderBottom: `1px solid ${C.border}`,
              }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: C.dark, margin: 0 }}>
                    {h.quiz_mode === "group" ? "⚖ Similar Patterns" : "🎲 Mixed"} Quiz
                  </p>
                  <p style={{ fontSize: "12px", color: C.textMid, margin: "2px 0 0" }}>
                    {new Date(h.completed_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontSize: "16px", fontWeight: 700, margin: 0,
                    color: pct >= 80 ? C.green : pct >= 50 ? C.gold : C.red,
                  }}>
                    {h.correct_answers}/{h.total_questions}
                  </p>
                  <p style={{ fontSize: "11px", color: C.textMid, margin: 0 }}>{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Study Streak */}
      <div style={{ ...S.card, background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkAlt} 100%)`, color: C.bg }}>
        <p style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 8px" }}>Study Streak</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          {(weekDays.length > 0 ? weekDays : ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => ({
            day: d, studied: false,
          }))).map((d, i) => (
            <div key={i} style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 600,
              background: d.studied ? C.gold : "rgba(196,168,130,0.2)",
              color: d.studied ? C.dark : C.textLight,
            }}>{d.day}</div>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>
          {streak > 0 ? `${streak} day streak! Keep it going` : "Start studying to build your streak!"}
        </p>
      </div>

      {/* Marking Summary */}
      {totalMarked > 0 && (
        <div style={S.card}>
          <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: "0 0 12px" }}>Marking Breakdown</p>
          {Object.entries(MARKING).map(([k, m]) => {
            const count = stats[k] || 0;
            if (count === 0 && Number(k) === 0) return null;
            const pct = totalMarked > 0 ? Math.round((count / totalMarked) * 100) : 0;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: m.bg, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", flexShrink: 0,
                }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: m.text }}>{m.label}</span>
                    <span style={{ fontSize: "12px", color: C.textMid }}>{count}</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "#EDE6DC", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: m.bg, borderRadius: "3px", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
