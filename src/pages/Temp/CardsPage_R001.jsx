import { useState } from 'react';
import { useGrammarPoints, useGrammarGroups, useConjunctions } from '../hooks/useGrammar';
import { useCardMarks } from '../hooks/useCardMarks';
import { useStreak } from '../hooks/useProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { MARKING } from '../lib/constants';
import { C, S } from '../lib/styles';

export default function CardsPage() {
  const { data: grammarData, loading: grammarLoading } = useGrammarPoints();
  const { groups: grammarGroups } = useGrammarGroups();
  const { data: conjunctions, loading: conjLoading } = useConjunctions();
  const { markCard, getMarkLevel, getStats } = useCardMarks();
  const { recordStudy } = useStreak();

  const [deckMode, setDeckMode] = useState(null);
  const [current, setCurrent] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const [sessionStats, setSessionStats] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [showMarkPanel, setShowMarkPanel] = useState(false);

  if (grammarLoading || conjLoading) return <LoadingSpinner message="Loading cards..." />;

  const getDeck = () => {
    if (!deckMode) return [];
    if (deckMode === "all") return grammarData;
    if (deckMode === "conjunctions") return conjunctions.map(c => ({
      id: c.id, title: c.kana, meaning: c.meaning, kanji: c.kanji, type: "conjunction",
    }));
    if (deckMode.startsWith("group:")) {
      const gId = deckMode.split(":")[1];
      return grammarData.filter(g => g.group_id === gId);
    }
    return grammarData;
  };

  const deck = getDeck();
  const card = deck[current];

  const getHints = (c) => {
    if (!c) return [];
    if (c.type === "conjunction") {
      return [{ label: "Meaning", content: c.meaning }];
    }
    const hints = [{ label: "Meaning", content: c.meaning }];
    if (c.nuance) hints.push({ label: "Nuance", content: c.nuance });
    if (c.formation_list?.length) hints.push({ label: "Formation", content: c.formation_list.join("\n") });
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
    if (revealStep < totalHints) setRevealStep(revealStep + 1);
  };

  const handleMark = async (level) => {
    const type = card.type === "conjunction" ? "conjunction" : "grammar";
    await markCard(type, card.id, level);
    setSessionStats({ ...sessionStats, [level]: sessionStats[level] + 1 });
    setRevealStep(0);
    setShowMarkPanel(false);
    recordStudy('flashcard');
    setTimeout(() => {
      setCurrent(current < deck.length - 1 ? current + 1 : 0);
    }, 150);
  };

  const resetDeck = () => {
    setDeckMode(null); setCurrent(0); setRevealStep(0); setShowMarkPanel(false);
    setSessionStats({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  };

  // ── Deck Selection ──
  if (deckMode === null) {
    return (
      <div>
        <div style={{ ...S.card, textAlign: "center", padding: "28px 20px", background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkAlt} 100%)`, color: C.bg }}>
          <p style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px" }}>Choose Deck</p>
          <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>Progressive reveal flashcards</p>
        </div>

        {/* All Grammar */}
        <div style={{ ...S.card, cursor: "pointer" }} onClick={() => setDeckMode("all")}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📚</span>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: 0 }}>All Grammar Points</p>
              <p style={{ fontSize: "13px", color: C.textMid, margin: "2px 0 0" }}>{grammarData.length} cards</p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: "20px", color: C.gold }}>→</span>
          </div>
        </div>

        {/* By Group */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <span style={{ fontSize: "24px" }}>⚖</span>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: 0 }}>By Group</p>
              <p style={{ fontSize: "13px", color: C.textMid, margin: "2px 0 0" }}>Study similar patterns together</p>
            </div>
          </div>
          {grammarGroups.map(grp => {
            const count = grammarData.filter(g => g.group_id === grp.id).length;
            return (
              <button key={grp.id}
                onClick={() => setDeckMode(`group:${grp.id}`)}
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
                  {count} cards
                </span>
              </button>
            );
          })}
        </div>

        {/* Conjunctions */}
        <div style={{ ...S.card, cursor: "pointer" }} onClick={() => setDeckMode("conjunctions")}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔗</span>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: C.dark, margin: 0 }}>Conjunctions</p>
              <p style={{ fontSize: "13px", color: C.textMid, margin: "2px 0 0" }}>{conjunctions.length} cards</p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: "20px", color: C.gold }}>→</span>
          </div>
        </div>
      </div>
    );
  }

  if (!card) return null;
  const isGrammar = card.type !== "conjunction";
  const total = Object.values(sessionStats).reduce((a, b) => a + b, 0);

  // Get existing mark for current card
  const existingMark = getMarkLevel(isGrammar ? "grammar" : "conjunction", card.id);

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

      {/* Session stats mini-bar */}
      {total > 0 && (
        <div style={{ display: "flex", gap: "4px", marginBottom: "14px", flexWrap: "wrap" }}>
          {Object.entries(MARKING).map(([k, m]) => {
            const count = sessionStats[k];
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

      {/* Existing mark indicator */}
      {existingMark !== null && existingMark !== undefined && (
        <div style={{
          display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px",
          padding: "6px 12px", borderRadius: "8px", fontSize: "12px",
          background: MARKING[existingMark]?.lightBg, border: `1px solid ${MARKING[existingMark]?.border}`,
          color: MARKING[existingMark]?.text, fontWeight: 500,
        }}>
          <span>{MARKING[existingMark]?.icon}</span>
          Current mark: {MARKING[existingMark]?.label}
        </div>
      )}

      {/* ── Card Front ── */}
      <div style={{
        ...S.card, padding: "28px 24px", textAlign: "center",
        background: revealStep === 0 ? C.surface : `linear-gradient(180deg, ${C.surface} 0%, #FAF7F3 100%)`,
        border: `2px solid ${revealStep > 0 ? C.gold : C.borderLight}`,
        transition: "all 0.3s ease",
      }}>
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
                    onClick={() => handleMark(Number(k))}
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
