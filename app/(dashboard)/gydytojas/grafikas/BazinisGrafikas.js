export default function BazinisGrafikas({ grafikas, updateDiena, onSave, saving }) {
  const dienuPavadinimai = ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"];

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
      <div className="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold m-0 text-white">🗓️ Savaitės grafikas</h4>
        <button className="btn btn-primary px-4 fw-bold shadow-sm" onClick={onSave} disabled={saving}>
          {saving ? "Saugoma..." : "Išsaugoti viską"}
        </button>
      </div>
      <div className="card-body p-0">
        {grafikas.map((d, index) => (
          <div key={index} className={`p-4 border-bottom ${!d.dirba ? 'bg-light opacity-75' : 'bg-white'}`}>
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="form-check form-switch p-0 d-flex align-items-center gap-3">
                  <input className="form-check-input ms-0 mt-0" type="checkbox" style={{ width: '2.5rem', height: '1.25rem' }} 
                    checked={d.dirba} onChange={e => updateDiena(index, 'dirba', e.target.checked)} />
                  <span className="fw-bold">{dienuPavadinimai[d.savaitesDiena]}</span>
                </div>
              </div>
              {d.dirba ? (
                <div className="col-md-9 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <input type="time" className="form-control" value={d.pradzia || ""} onChange={e => updateDiena(index, 'pradzia', e.target.value)} />
                    <span className="text-muted small">iki</span>
                    <input type="time" className="form-control" value={d.pabaiga || ""} onChange={e => updateDiena(index, 'pabaiga', e.target.value)} />
                  </div>

                </div>
              ) : <div className="col-md-9 text-muted italic small text-end">Šią dieną vizitai nepriimami</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}