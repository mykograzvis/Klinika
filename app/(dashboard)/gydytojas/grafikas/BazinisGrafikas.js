import styles from "./grafikas.module.css";

export default function BazinisGrafikas({ grafikas, updateDiena, onSave, saving }) {
  const dienuPavadinimai = ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"];

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Savaitės grafikas</h2>
        <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? "Saugoma..." : "Išsaugoti"}
        </button>
      </div>

      <div className={styles.scheduleGrid}>
        {grafikas.map((d, index) => (
          <div
            key={index}
            className={`${styles.dayRow} ${!d.dirba ? styles.dayRowOff : ""}`}
          >
            <div className={styles.dayLeft}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={d.dirba}
                  onChange={e => updateDiena(index, "dirba", e.target.checked)}
                />
                <span className={styles.toggleTrack} />
              </label>
              <span className={`${styles.dayName} ${!d.dirba ? styles.dayNameOff : ""}`}>
                {dienuPavadinimai[d.savaitesDiena]}
              </span>
            </div>

            {d.dirba ? (
              <div className={styles.timeInputs}>
                <input
                  type="time"
                  className={styles.timeInput}
                  value={d.pradzia || ""}
                  onChange={e => updateDiena(index, "pradzia", e.target.value)}
                  lang="lt-LT"
                  step="900"
                />
                <span className={styles.timeSep}>—</span>
                <input
                  type="time"
                  className={styles.timeInput}
                  value={d.pabaiga || ""}
                  onChange={e => updateDiena(index, "pabaiga", e.target.value)}
                  lang="lt-LT"
                  step="900"
                />
              </div>
            ) : (
              <span className={styles.closedLabel}>Nepriimama</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
