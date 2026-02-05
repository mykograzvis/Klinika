import { useState } from "react";

export default function GrafikoIsimtys({ isimtys, naujaIsimtis, setNaujaIsimtis, onAdd, onDelete }) {
  // Pridedame vietinę būseną navigacijai tarp mėnesių
  const [rodomasMenuo, setRodomasMenuo] = useState(new Date());

  // Funkcijos mėnesių keitimui
  const keistiMnesi = (kiek) => {
    const naujaData = new Date(rodomasMenuo);
    naujaData.setMonth(naujaData.getMonth() + kiek);
    setRodomasMenuo(naujaData);
  };

  const siasMenuo = rodomasMenuo.getMonth();
  const sieMetai = rodomasMenuo.getFullYear();

  // Filtruojame išimtis pagal pasirinktą mėnesį
  const filtruotosIsimtys = isimtys.filter(is => {
    const d = new Date(is.data);
    return d.getMonth() === siasMenuo && d.getFullYear() === sieMetai;
  });

  // Mėnesio pavadinimas lietuviškai (pvz., "2024 m. Vasaris")
  const menesioTekstas = rodomasMenuo.toLocaleString('lt-LT', { month: 'long', year: 'numeric' });

  return (
    <div className="row g-4 mb-5">
      {/* KAIRĖ: Pridėjimo forma */}
      <div className="col-md-5">
        <div className="card shadow-sm border-0 rounded-4 p-4 bg-warning bg-opacity-10 border-warning border-opacity-25">
          <h5 className="fw-bold mb-3">🚫 Paskelbti laisvą dieną</h5>
          <div className="mb-3">
            <label className="small fw-bold mb-1">Pasirinkite datą</label>
            <input 
              type="date" 
              className="form-control shadow-sm" 
              value={naujaIsimtis.data} 
              onChange={e => setNaujaIsimtis({...naujaIsimtis, data: e.target.value})} 
            />
          </div>
          <div className="mb-4">
            <label className="small fw-bold mb-1">Priežastis</label>
            <input 
              type="text" 
              className="form-control shadow-sm" 
              placeholder="Pvz. Atostogos" 
              value={naujaIsimtis.priezastis}
              onChange={e => setNaujaIsimtis({...naujaIsimtis, priezastis: e.target.value})} 
            />
          </div>
          <button className="btn btn-warning w-100 fw-bold shadow-sm" onClick={onAdd}>
            Patvirtinti
          </button>
        </div>
      </div>

      {/* DEŠINĖ: Sąrašas su navigacija */}
      <div className="col-md-7">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-header bg-light d-flex justify-content-between align-items-center p-3">
            <button className="btn btn-outline-secondary btn-sm rounded-circle" onClick={() => keistiMnesi(-1)}>
              &larr;
            </button>
            
            <h6 className="m-0 fw-bold text-capitalize text-dark">
              {menesioTekstas}
            </h6>
            
            <button className="btn btn-outline-secondary btn-sm rounded-circle" onClick={() => keistiMnesi(1)}>
              &rarr;
            </button>
          </div>

          <div className="card-body p-0 overflow-auto" style={{ maxHeight: '400px' }}>
            {filtruotosIsimtys.length === 0 ? (
              <div className="p-5 text-center text-muted italic">
                <div className="mb-2">📅</div>
                Šį mėnesį išimčių nėra
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {filtruotosIsimtys.map((is) => (
                  <div key={is.id} className="list-group-item p-3 d-flex justify-content-between align-items-center bg-hover-light">
                    <div>
                      <div className="fw-bold text-primary">
                        {new Date(is.data).toLocaleDateString('lt-LT', { day: '2-digit', month: '2-digit' })}
                      </div>
                      <div className="text-muted small">{is.priezastis}</div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-danger rounded-pill px-3">NEDIRBA</span>
                      <button 
                        className="btn btn-sm btn-outline-danger border-0 rounded-circle" 
                        onClick={() => onDelete(is.id)}
                        title="Ištrinti"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}