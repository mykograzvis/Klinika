import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./vizitai.module.css";
import sideStyles from "./kaire.module.css";

export default function Sidebar({ vizitai, selectedVizitas, setSelectedVizitas, viewDate, setViewDate }) {
  const [showCancelled, setShowCancelled] = useState(false);

  const filtruoti = showCancelled ? vizitai : vizitai.filter(v => v.busena !== "Atšauktas");

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const d = date.setHours(0, 0, 0, 0);
    return vizitai.some(v => v.busena !== "Atšauktas" && new Date(v.pradziosLaikas).setHours(0, 0, 0, 0) === d)
      ? "has-appointment" : null;
  };

  const getAntraste = v => {
    const pros = v.atliktosProceduros || v.AtliktosProceduros || [];
    return pros.length > 0 ? (pros[0].pavadinimas || pros[0].Pavadinimas) : (v.pastabos || "Konsultacija");
  };

  const dienosEile = filtruoti
    .filter(v => new Date(v.pradziosLaikas).toLocaleDateString("lt-LT") === viewDate.toLocaleDateString("lt-LT"))
    .sort((a, b) => new Date(a.pradziosLaikas) - new Date(b.pradziosLaikas));

  return (
    <div className={sideStyles.sidebar}>
      <div className={sideStyles.calendarBlock}>
        <div className={sideStyles.calHeader}>
          <span className={sideStyles.calTitle}>Kalendorius</span>
          <button className={sideStyles.todayBtn} onClick={() => setViewDate(new Date())}>
            Šiandien
          </button>
        </div>
        <Calendar
          onChange={setViewDate}
          value={viewDate}
          locale="lt-LT"
          tileClassName={tileClassName}
          className="vizitai-calendar"
        />
      </div>

      <div className={sideStyles.dayBlock}>
        <div className={sideStyles.dayHeader}>
          <span className={sideStyles.dayTitle}>Dienos vizitai</span>
          <label className={sideStyles.toggleLabel}>
            <input
              type="checkbox"
              checked={showCancelled}
              onChange={() => setShowCancelled(s => !s)}
              className={sideStyles.toggleInput}
            />
            <span className={sideStyles.toggleTrack} />
            <span className={sideStyles.toggleText}>Atšaukti</span>
          </label>
        </div>

        <div className={sideStyles.dayList}>
          {dienosEile.length === 0 ? (
            <p className={sideStyles.emptyDay}>Šią dieną vizitų nėra.</p>
          ) : (
            dienosEile.map(v => {
              const isSelected = selectedVizitas?.id === v.id;
              const isCancelled = v.busena === "Atšauktas";
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVizitas(v)}
                  className={`${sideStyles.vizitasCard} ${isSelected ? sideStyles.vizitasSelected : ""} ${isCancelled ? sideStyles.vizitasCancelled : ""}`}
                >
                  <div className={sideStyles.vizitasTop}>
                    <span className={sideStyles.vizitasTime}>
                      {new Date(v.pradziosLaikas).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className={`${sideStyles.vizitasBadge} ${isCancelled ? sideStyles.vizitasBadgeCancelled : ""}`}>
                      {isCancelled ? "Atšauktas" : `${v.bendraSuma} €`}
                    </span>
                  </div>
                  <p className={sideStyles.vizitasName}>{v.pacientoVardas}</p>
                  <p className={sideStyles.vizitasProc}>{getAntraste(v)}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
