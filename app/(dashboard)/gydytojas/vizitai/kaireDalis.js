import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Sidebar({ vizitai, selectedVizitas, setSelectedVizitas, viewDate, setViewDate }) {
  // Nauja būsena: ar rodyti atšauktus vizitus?
  const [showCancelled, setShowCancelled] = useState(false);

  // 1. Filtravimas: rodome visus arba tik neatšauktus
  const filtruotiVizitai = showCancelled 
    ? vizitai 
    : vizitai.filter(v => v.busena !== "Atšauktas");

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const d = new Date(date).setHours(0, 0, 0, 0);
      // Kalendoriuje taškelius rodome tik neatšauktiems vizitams (kad neklaidintų)
      return vizitai.some(v => v.busena !== "Atšauktas" && new Date(v.pradziosLaikas).setHours(0, 0, 0, 0) === d) 
        ? 'has-appointment' 
        : null;
    }
  };

  const getVizitoAntraste = (v) => {
    const pros = v.atliktosProceduros || v.AtliktosProceduros || [];
    return pros.length > 0 ? (pros[0].pavadinimas || pros[0].Pavadinimas) : (v.pastabos || "Konsultacija");
  };

  // 2. Dienos sąrašo filtravimas ir rūšiavimas
  const dienosEile = filtruotiVizitai
    .filter(v => new Date(v.pradziosLaikas).toLocaleDateString('lt-LT') === viewDate.toLocaleDateString('lt-LT'))
    .sort((a, b) => new Date(a.pradziosLaikas) - new Date(b.pradziosLaikas));

  return (
    <div className="col-md-3 border-end bg-white h-100 d-flex flex-column shadow-sm no-print" style={{ zIndex: 10 }}>
      <div className="p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold text-dark mb-0 small text-uppercase">Kalendorius</h6>
          <button className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" onClick={() => setViewDate(new Date())}>Šiandien</button>
        </div>
        <Calendar 
          onChange={setViewDate} 
          value={viewDate} 
          locale="lt-LT" 
          tileClassName={tileClassName} 
          className="border-0 w-100 small-calendar" 
        />
      </div>

      <div className="flex-grow-1 overflow-auto p-3 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="small fw-bold text-muted text-uppercase mb-0">Dienos vizitai</h6>
          
          {/* Perjungiklis (Toggle) */}
          <div className="form-check form-switch m-0">
            <input 
              className="form-check-input cursor-pointer" 
              type="checkbox" 
              id="showCancelled" 
              checked={showCancelled} 
              onChange={() => setShowCancelled(!showCancelled)} 
            />
            <label className="form-check-label small text-muted cursor-pointer" htmlFor="showCancelled">
              Rodyti atšauktus
            </label>
          </div>
        </div>

        {dienosEile.length === 0 ? (
          <div className="text-center py-5 text-muted small bg-white rounded-4 border border-dashed">
            Šią dieną vizitų nėra
          </div>
        ) : (
          dienosEile.map(v => (
            <div 
              key={v.id} 
              onClick={() => setSelectedVizitas(v)} 
              className={`p-3 mb-3 rounded-4 cursor-pointer transition-all border-0 shadow-sm ${
                selectedVizitas?.id === v.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : v.busena === 'Atšauktas' 
                    ? 'bg-danger-subtle opacity-75' // Atšauktiems vizitams suteikiame silpnesnę raudoną spalvą
                    : 'bg-white text-dark hover-card'
              }`}
            >
              <div className="d-flex justify-content-between align-items-start mb-1">
                <div className="fw-bold fs-5">
                  {new Date(v.pradziosLaikas).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <span className={`badge rounded-pill ${
                  selectedVizitas?.id === v.id 
                    ? 'bg-white text-primary' 
                    : v.busena === 'Atšauktas' 
                      ? 'bg-danger text-white' 
                      : 'bg-light text-muted border'
                }`}>
                  {v.busena === 'Atšauktas' ? 'Atšaukta' : `${v.bendraSuma} €`}
                </span>
              </div>
              <div className="fw-bold mb-1">{v.pacientoVardas}</div>
              <div className={`small fw-medium ${
                selectedVizitas?.id === v.id 
                  ? 'text-white-50' 
                  : v.busena === 'Atšauktas' 
                    ? 'text-danger' 
                    : 'text-primary'
              }`}>
                {getVizitoAntraste(v)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}