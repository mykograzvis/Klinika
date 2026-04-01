import { useState } from "react";
import styles from "./vizitai.module.css";

export default function PatientHistory({ selectedVizitas, visiVizitai }) {
  const [historySearch, setHistorySearch] = useState("");

  const istorija = visiVizitai
    .filter(v => selectedVizitas && v.pacientoVardas === selectedVizitas.pacientoVardas && v.id !== selectedVizitas.id)
    .sort((a, b) => new Date(b.pradziosLaikas) - new Date(a.pradziosLaikas));

  const filtered = istorija.filter(h => {
    if (!historySearch) return true;
    const pros = h.atliktosProceduros || h.AtliktosProceduros || [];
    return pros.some(p => (p.pavadinimas || p.Pavadinimas).toLowerCase().includes(historySearch.toLowerCase()));
  });

  return (
    <div className={`${styles.panel} ${styles.panelRight} no-print`}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Istorija</span>
        {selectedVizitas && (
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Ieškoti..."
            value={historySearch}
            onChange={e => setHistorySearch(e.target.value)}
          />
        )}
      </div>

      <div className={styles.panelScroll}>
        {!selectedVizitas ? (
          <p className={styles.emptyHint}>Pasirinkite vizitą.</p>
        ) : filtered.length === 0 ? (
          <p className={styles.emptyHint}>
            {historySearch ? "Nerasta." : "Ankstesnių vizitų nėra."}
          </p>
        ) : (
          filtered.map(h => {
            const pros = h.atliktosProceduros || h.AtliktosProceduros || [];
            return (
              <div key={h.id} className={styles.historyCard}>
                <div className={styles.historyCardTop}>
                  <span className={styles.historyDate}>
                    {new Date(h.pradziosLaikas).toLocaleDateString("lt-LT")}
                  </span>
                  <span className={styles.historySum}>{h.bendraSuma} €</span>
                </div>
                <div className={styles.historyPros}>
                  {pros.map((p, i) => (
                    <span key={i} className={styles.historyPro}>
                      {p.pavadinimas || p.Pavadinimas}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
