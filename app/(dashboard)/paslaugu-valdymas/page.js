"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import API_URL from '@/services/api';
import { useToast } from "@/context/ToastContext";

export default function PaslauguValdymas() {
  const router = useRouter();
  const { success, error, warning } = useToast();

  const [paslaugos, setPaslaugos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    pavadinimas: "",
    specializacija: "",
    kaina: "",
    trukmeMin: "",
    aktyvi: true,
    sinonimiai: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const specializacijos = useMemo(() => [
    "Burnos higienistas",
    "Gydytojas odontologas",
    "Burnos chirurgas",
    "Endodontas",
  ], []);

  const trukmes = useMemo(() => [
    { label: "30 min.", value: 30 },
    { label: "60 min.", value: 60 },
    { label: "90 min.", value: 90 },
    { label: "120 min.", value: 120 },
  ], []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setUserRole(role);

    if (role !== "Adminas") {
      router.push("/");
      return;
    }

    fetchPaslaugos();
  }, [router]);

  const fetchPaslaugos = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Paslaugos?tik_aktyvios=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPaslaugos(data);
      } else {
        error("Klaida", "Nepavyko gauti paslaugų sąrašo.");
      }
    } catch (err) {
      error("Sistemos klaida", "Nepavyko prisijungti prie serverio.");
    }
  };

  const filtruotosPaslaugos = useMemo(() => {
    let result = paslaugos;

    if (!showInactive) {
      result = result.filter(p => p.aktyvi);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.pavadinimas.toLowerCase().includes(q) ||
        p.specializacija.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => a.id - b.id);
  }, [paslaugos, searchQuery, showInactive]);

  const validateForm = () => {
    const errors = {};
    if (!formData.pavadinimas.trim()) errors.pavadinimas = "Pavadinimas privalomas";
    if (!formData.specializacija) errors.specializacija = "Specializacija privaloma";
    if (!formData.kaina || parseFloat(formData.kaina) <= 0) errors.kaina = "Kaina turi būti didesnė už 0";
    if (!formData.trukmeMin) errors.trukmeMin = "Trukmė privaloma";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData({
      pavadinimas: "",
      specializacija: "",
      kaina: "",
      trukmeMin: "",
      aktyvi: true,
      sinonimiai: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (paslauga) => {
    setModalMode("edit");
    setEditingId(paslauga.id);
    setFormData({
      pavadinimas: paslauga.pavadinimas,
      specializacija: paslauga.specializacija,
      kaina: paslauga.kaina.toString(),
      trukmeMin: paslauga.trukmeMin.toString(),
      aktyvi: paslauga.aktyvi,
      sinonimiai: paslauga.sinonimiai || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    const dto = {
      pavadinimas: formData.pavadinimas.trim(),
      specializacija: formData.specializacija,
      kaina: parseFloat(formData.kaina),
      trukmeMin: parseInt(formData.trukmeMin),
      aktyvi: formData.aktyvi,
      sinonimiai: formData.sinonimiai.trim() || null,
    };

    try {
      const url = modalMode === "create" 
        ? `${API_URL}/api/Paslaugos`
        : `${API_URL}/api/Paslaugos/${editingId}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (res.ok) {
        success(
          modalMode === "create" ? "Paslauga sukurta!" : "Paslauga atnaujinta!",
          modalMode === "create" 
            ? "Nauja paslauga sėkmingai pridėta."
            : "Paslaugos duomenys sėkmingai atnaujinti."
        );
        closeModal();
        fetchPaslaugos();
      } else {
        const errData = await res.json().catch(() => ({ error: "Nežinoma klaida" }));
        error("Klaida", errData.error || "Operacija nepavyko.");
      }
    } catch (err) {
      error("Sistemos klaida", "Nepavyko atlikti operacijos. Bandykite dar kartą.");
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id, pavadinimas) => {
    if (!confirm(`Ar tikrai norite išjungti paslaugą "${pavadinimas}"?`)) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Paslaugos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        success("Paslauga išjungta", `Paslauga "${pavadinimas}" sėkmingai išjungta.`);
        fetchPaslaugos();
      } else {
        error("Klaida", "Nepavyko išjungti paslaugos.");
      }
    } catch (err) {
      error("Sistemos klaida", "Nepavyko prisijungti prie serverio.");
    }
  };

  const handleHardDelete = async (id, pavadinimas) => {
    if (!confirm(`⚠️ AR TIKRAI?\n\nPaslauga "${pavadinimas}" bus ištrinta VISAM LAIKUI.\n\nŠio veiksmo nebus galima atšaukti!`)) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Paslaugos/${id}/permanent`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        success("Paslauga ištrinta", `Paslauga "${pavadinimas}" visam laikui ištrinta.`);
        fetchPaslaugos();
      } else {
        error("Klaida", "Nepavyko ištrinti paslaugos.");
      }
    } catch (err) {
      error("Sistemos klaida", "Nepavyko prisijungti prie serverio.");
    }
  };

  const handleRestore = async (id, pavadinimas) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Paslaugos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pavadinimas,
          specializacija: paslaugos.find(p => p.id === id)?.specializacija,
          kaina: paslaugos.find(p => p.id === id)?.kaina,
          trukmeMin: paslaugos.find(p => p.id === id)?.trukmeMin,
          aktyvi: true,
        }),
      });

      if (res.ok) {
        success("Paslauga aktyvuota", `Paslauga "${pavadinimas}" vėl aktyvi.`);
        fetchPaslaugos();
      } else {
        error("Klaida", "Nepavyko aktyvuoti paslaugos.");
      }
    } catch (err) {
      error("Sistemos klaida", "Nepavyko prisijungti prie serverio.");
    }
  };

  if (userRole !== "Adminas") {
    return (
      <div className="w-100 min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h4 className="text-muted">Prieiga uždrausta</h4>
          <p className="text-muted">Neturite teisių matyti šį puslapį.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 min-vh-100 bg-light py-4 d-flex flex-column align-items-center">
      <div className="px-3" style={{ width: "90%", maxWidth: "900px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-dark m-0">
            Paslaugų valdymas
          </h4>
          <button
            className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
            onClick={openCreateModal}
          >
            + Nauja paslauga
          </button>
        </div>

        {/* Search and filters */}
        <div className="card shadow-sm border-0 rounded-4 mb-3 bg-white">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control form-control-lg border-2 rounded-4"
                  placeholder="Ieškoti pagal pavadinimą ar specializaciją..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <div className="form-check form-switch d-flex align-items-center gap-2 ms-md-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showInactive"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    style={{ width: "3em", height: "1.5em", cursor: "pointer" }}
                  />
                  <label className="form-check-label fw-semibold text-muted" htmlFor="showInactive" style={{ cursor: "pointer" }}>
                    Rodyti neaktyvias
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services list */}
        <div className="d-flex flex-column gap-3">
          {filtruotosPaslaugos.length === 0 ? (
            <div className="card shadow-sm border-0 rounded-4 bg-white">
              <div className="card-body p-5 text-center">
                <div className="text-muted mb-2">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <h6 className="text-muted">Paslaugų nerasta</h6>
                <p className="text-muted small mb-0">
                  {searchQuery ? "Pabandykite pakeisti paieškos kriterijus." : "Sąrašas tuščias. Sukurkite naują paslaugą."}
                </p>
              </div>
            </div>
          ) : (
            filtruotosPaslaugos.map((p) => (
              <div
                key={p.id}
                className={`card shadow-sm border-0 rounded-4 overflow-hidden transition-all ${!p.aktyvi ? 'opacity-75' : ''}`}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h5 className="fw-bold m-0">{p.pavadinimas}</h5>
                        {!p.aktyvi && (
                          <span className="badge bg-secondary rounded-pill">Išjungta</span>
                        )}
                      </div>
                      <div className="d-flex flex-wrap gap-3 text-muted small">
                        <span className="d-flex align-items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                          </svg>
                          {p.specializacija}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {p.trukmeMin} min.
                        </span>
                        {p.sinonimiai && (
                          <span className="d-flex align-items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                            </svg>
                            Sinonimai: {p.sinonimiai}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-2 ms-3">
                      <span className="fw-bold text-primary fs-4">{p.kaina} €</span>
                      <div className="d-flex gap-1">
                        {p.aktyvi ? (
                          <>
                            <button
                              className="btn btn-sm btn-outline-primary rounded-3 px-3"
                              onClick={() => openEditModal(p)}
                              title="Redaguoti"
                            >
                              Redaguoti
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning rounded-3 px-3"
                              onClick={() => handleSoftDelete(p.id, p.pavadinimas)}
                              title="Išjungti"
                            >
                              Išjungti
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-outline-success rounded-3 px-3"
                              onClick={() => handleRestore(p.id, p.pavadinimas)}
                              title="Aktyvuoti"
                            >
                              Aktyvuoti
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-3 px-3"
                              onClick={() => handleHardDelete(p.id, p.pavadinimas)}
                              title="Ištrinti visam laikui"
                            >
                              Ištrinti
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {modalMode === "create" ? "Nauja paslauga" : "Redaguoti paslaugą"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Pavadinimas
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg border-2 rounded-4 ${formErrors.pavadinimas ? 'is-invalid' : ''}`}
                    placeholder="Pvz.: Burnos higiena"
                    value={formData.pavadinimas}
                    onChange={(e) => setFormData({ ...formData, pavadinimas: e.target.value })}
                  />
                  {formErrors.pavadinimas && (
                    <div className="invalid-feedback">{formErrors.pavadinimas}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Specializacija
                  </label>
                  <select
                    className={`form-select form-select-lg border-2 rounded-4 ${formErrors.specializacija ? 'is-invalid' : ''}`}
                    value={formData.specializacija}
                    onChange={(e) => setFormData({ ...formData, specializacija: e.target.value })}
                  >
                    <option value="">-- Pasirinkite --</option>
                    {specializacijos.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {formErrors.specializacija && (
                    <div className="invalid-feedback">{formErrors.specializacija}</div>
                  )}
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold small text-muted text-uppercase">
                      Kaina (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control form-control-lg border-2 rounded-4 ${formErrors.kaina ? 'is-invalid' : ''}`}
                      placeholder="0.00"
                      value={formData.kaina}
                      onChange={(e) => setFormData({ ...formData, kaina: e.target.value })}
                    />
                    {formErrors.kaina && (
                      <div className="invalid-feedback">{formErrors.kaina}</div>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold small text-muted text-uppercase">
                      Trukmė
                    </label>
                    <select
                      className={`form-select form-select-lg border-2 rounded-4 ${formErrors.trukmeMin ? 'is-invalid' : ''}`}
                      value={formData.trukmeMin}
                      onChange={(e) => setFormData({ ...formData, trukmeMin: e.target.value })}
                    >
                      <option value="">-- min. --</option>
                      {trukmes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {formErrors.trukmeMin && (
                      <div className="invalid-feedback">{formErrors.trukmeMin}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Sinonimiai (neprivaloma)
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2 rounded-4"
                    placeholder="Pvz.: Profilaktinis valymas"
                    value={formData.sinonimiai}
                    onChange={(e) => setFormData({ ...formData, sinonimiai: e.target.value })}
                  />
                </div>

                {modalMode === "edit" && (
                  <div className="form-check form-switch d-flex align-items-center gap-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="aktyviSwitch"
                      checked={formData.aktyvi}
                      onChange={(e) => setFormData({ ...formData, aktyvi: e.target.checked })}
                      style={{ width: "3em", height: "1.5em", cursor: "pointer" }}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="aktyviSwitch" style={{ cursor: "pointer" }}>
                      Paslauga aktyvi
                    </label>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4 fw-bold"
                  onClick={closeModal}
                >
                  Atšaukti
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 fw-bold"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : modalMode === "create" ? (
                    "Sukurti"
                  ) : (
                    "Išsaugoti"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .transition-all {
          transition: all 0.2s ease;
        }
        .hover-select:hover {
          background-color: #f8f9fa;
          border-color: #0d6efd !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .modal.show {
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}