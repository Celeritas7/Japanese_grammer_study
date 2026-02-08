import { useState } from 'react';
import { useGrammarPoints, useGrammarGroups } from '../hooks/useGrammar';
import LoadingSpinner from '../components/LoadingSpinner';
import { C, S } from '../lib/styles';

// ─── Comparison Table (inline) ───────────────────────────────────
function ComparisonTable({ groupId, grammarData, grammarGroups }) {
  const items = grammarData.filter(g => g.group_id === groupId);
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
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: "#FAF7F3" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Key Examples</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {items.map(item => (
            <div key={item.id} style={{ flex: "1 1 150px", borderLeft: `3px solid ${C.gold}`, paddingLeft: "10px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: C.gold, margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ fontSize: "14px", color: C.dark, margin: "0 0 2px" }}>{item.examples?.[0]?.jp}</p>
              <p style={{ fontSize: "11px", color: C.textMid, margin: 0, fontStyle: "italic" }}>{item.examples?.[0]?.en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Grammar Page ───────────────────────────────────────────
export default function GrammarPage() {
  const { data: grammarData, loading } = useGrammarPoints();
  const { groups: grammarGroups } = useGrammarGroups();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('compare');
  const [selectedDay, setSelectedDay] = useState(null);
  const [expanded, setExpanded] = useState(null);

  if (loading) return <LoadingSpinner message="Loading grammar..." />;

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
    const items = grammarData.filter(g => g.group_id === grp.id);
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

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button onClick={() => setViewMode("compare")}
          style={{ ...S.btn(viewMode === "compare" ? C.dark : "transparent", viewMode === "compare" ? C.bg : C.textLight), border: viewMode === "compare" ? "none" : `1px solid ${C.borderMid}`, padding: "8px 16px", fontSize: "13px" }}>
          ⚖ Compare View
        </button>
        <button onClick={() => setViewMode("list")}
          style={{ ...S.btn(viewMode === "list" ? C.dark : "transparent", viewMode === "list" ? C.bg : C.textLight), border: viewMode === "list" ? "none" : `1px solid ${C.borderMid}`, padding: "8px 16px", fontSize: "13px" }}>
          ☰ List View
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button
          style={{ padding: "8px 16px", borderRadius: "20px", border: selectedDay === null ? `2px solid ${C.gold}` : `2px solid ${C.borderMid}`, background: selectedDay === null ? C.gold : "transparent", color: selectedDay === null ? C.dark : C.textLight, fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}
          onClick={() => setSelectedDay(null)}>All Days</button>
        {days.map(d => (
          <button key={d}
            style={{ padding: "8px 16px", borderRadius: "20px", border: selectedDay === d ? `2px solid ${C.gold}` : `2px solid ${C.borderMid}`, background: selectedDay === d ? C.gold : "transparent", color: selectedDay === d ? C.dark : C.textLight, fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}
            onClick={() => setSelectedDay(d)}>Day {d}</button>
        ))}
      </div>

      {viewMode === "compare" && (
        <div>
          {filteredGroups.map(grp => (
            <ComparisonTable key={grp.id} groupId={grp.id} grammarData={grammarData} grammarGroups={grammarGroups} />
          ))}
        </div>
      )}

      {viewMode === "list" && filtered.map(g => (
        <div key={g.id}
          style={{ ...S.card, cursor: "pointer", ...(expanded === g.id ? { boxShadow: "0 4px 20px rgba(44,36,32,0.1)" } : {}) }}
          onClick={() => setExpanded(expanded === g.id ? null : g.id)}>
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
            <span style={S.tag("#E8E0D4", C.textMid)}>{grammarGroups.find(gr => gr.id === g.group_id)?.label.split("·")[0]?.trim()}</span>
          </div>
          {expanded === g.id && (
            <div style={{ marginTop: "16px" }}>
              <p style={S.sectionTitle}>Formation</p>
              {(g.formation_list || []).map((f, i) => (
                <div key={i} style={{ fontSize: "14px", color: C.darkAlt, padding: "6px 0", borderBottom: `1px dashed ${C.borderLight}`, lineHeight: 1.5 }}>{f}</div>
              ))}
              <p style={S.sectionTitle}>Examples</p>
              {(g.examples || []).map((ex, i) => (
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
