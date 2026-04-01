import { useState } from "react";
import styles from "./grafikas.module.css";

export default function GrafikoIsimtys({ isimtys, naujaIsimtis, setNaujaIsimtis, onAdd, onDelete }) {
  const [rodomasMenuo, setRodomasMenuo] = useState(new Date());

  const keistiMnesi = (kiek) => {
    const d = new Date(rodomasMenuo);
    d.setMonth(d.getMonth() + kiek);
    setRodomasMenuo(d);
  };

  const siasMenuo = rodomasMenuo.getMonth();
  const sieMetai = rodomasMenuo.getFullYear();

  const filtruotos = isimtys.filter(is => {
    const d = new Date(is.data);
    return d.getMonth() === siasMenuo && d.getFullYear() === sieMetai;
  });

  const menesioTekstas = rodomasMenuo.toLocaleString("lt-LT", { month: "long", year: "numeric" });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Laisvadieniai</h2>
      </div>

      <div className={styles.exceptionsLayout}>
        {/* Forma */}
        <div className={styles.addForm}>
          <p className={styles.formLabel}>Data</p>
          <input
            type="date"
            className={styles.input}
            value={naujaIsimtis.data}
            onChange={e => setNaujaIsimtis({ ...naujaIsimtis, data: e.target.value })}
          />

          <p className={styles.formLabel} style={{ marginTop: "1rem" }}>Priežastis</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Pvz. Atostogos"
            value={naujaIsimtis.priezastis}
            onChange={e => setNaujaIsimtis({ ...naujaIsimtis, priezastis: e.target.value })}
          />

          <button className={styles.addBtn} onClick={onAdd} style={{ marginTop: "1.25rem" }}>
            Pridėti
          </button>
        </div>

        {/* Sąrašas */}
        <div className={styles.exceptionsList}>
          <div className={styles.monthNav}>
            <button className={styles.monthBtn} onClick={() => keistiMnesi(-1)}>←</button>
            <span className={styles.monthLabel}>{menesioTekstas}</span>
            <button className={styles.monthBtn} onClick={() => keistiMnesi(1)}>→</button>
          </div>

          {filtruotos.length === 0 ? (
            <div className={styles.emptyState}>Šį mėnesį laisvadienių nėra</div>
          ) : (
            <div className={styles.exceptionItems}>
              {filtruotos.map(is => (
                <div key={is.id} className={styles.exceptionItem}>
                  <div>
                    <span className={styles.exceptionDate}>
                      {new Date(is.data).toLocaleDateString("lt-LT", { day: "2-digit", month: "2-digit" })}
                    </span>
                    <span className={styles.exceptionReason}>{is.priezastis}</span>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(is.id)}
                    title="Ištrinti"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
