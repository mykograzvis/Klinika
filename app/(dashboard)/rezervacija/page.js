"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Rezervacija() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const paslaugos = [
    { id: 1, pavadinimas: "Burnos higiena", kaina: 50, specializacija: "Burnos higienistas", trukmeMin: 60 },
    { id: 2, pavadinimas: "Danties plombavimas", kaina: 80, specializacija: "Gydytojas odontologas", trukmeMin: 60 },
    { id: 3, pavadinimas: "Danties šalinimas", kaina: 120, specializacija: "Burnos chirurgas", trukmeMin: 90 },
    { id: 4, pavadinimas: "Konsultacija", kaina: 30, specializacija: "Gydytojas odontologas", trukmeMin: 30 },
    { id: 5, pavadinimas: "Danties implantacija", kaina: 800, specializacija: "Burnos chirurgas", trukmeMin: 120 },
    { id: 6, pavadinimas: "Kanalų gydymas", kaina: 150, specializacija: "Endodontas", trukmeMin: 90 },
    { id: 7, pavadinimas: "Plokštelės", kaina: 120, specializacija: "Gydytojas odontologas", trukmeMin: 60 },
  ];

  const visiGalimiLaikai = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  const artimiausiosDarboDienos = useMemo(() => {
    const dienos = [];
    let count = 0;
    let offset = 1;
    while (count < 20) {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dienos.push({
          pilna: d.toISOString().split("T")[0],
          diena: d.getDate(),
          savaitėsDiena: d.toLocaleDateString("lt-LT", { weekday: "short" }),
        });
        count++;
      }
      offset++;
    }
    return dienos;
  }, []);

  const [visiGydytojai, setVisiGydytojai] = useState([]);
  const [filtruotiGydytojai, setFiltruotiGydytojai] = useState([]);
  const [uzimtiLaikai, setUzimtiLaikai] = useState([]);
  const [visiVartotojai, setVartotojai] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFullDayBusy, setIsFullDayBusy] = useState(false);
  const [userRole, setUserRole] = useState("");

  const [formData, setFormData] = useState({
    paslaugaIndex: "",
    gydytojasId: "",
    pacientasId: "",
    data: artimiausiosDarboDienos[0].pilna,
    laikas: "",
  });

  const [pacientoPaieska, setPacientoPaieska] = useState("");

  const filtruotiPacientai = useMemo(() => {
    if (!pacientoPaieska.trim()) return visiVartotojai;

    const q = pacientoPaieska.toLowerCase();

    return visiVartotojai.filter((u) => {
      const fullName = `${u.vardas} ${u.pavarde}`.toLowerCase();
      const email = (u.elPastas || u.email || "").toLowerCase();
      return fullName.includes(q) || email.includes(q);
    });
  }, [pacientoPaieska, visiVartotojai]);

  const pasirinktasPacientas = useMemo(() => {
    if (!formData.pacientasId) return null;
    return (
      visiVartotojai.find(
        (u) => String(u.id) === String(formData.pacientasId)
      ) || null
    );
  }, [formData.pacientasId, visiVartotojai]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setUserRole(role);

    fetch("https://localhost:7237/api/Gydytojai", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVisiGydytojai(data))
      .catch((err) => console.error(err));

    if (role === "Adminas" || role === "Gydytojas") {
      fetch("https://localhost:7237/api/Vartotojai", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const tikPacientai = data.filter((u) => u.role === "Pacientas");
          setVartotojai(tikPacientai);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    if (formData.paslaugaIndex !== "") {
      const p = paslaugos[parseInt(formData.paslaugaIndex)];
      setFiltruotiGydytojai(
        visiGydytojai.filter((g) => g.specializacija === p.specializacija)
      );
    }
  }, [formData.paslaugaIndex, visiGydytojai]);

  useEffect(() => {
    if (formData.gydytojasId && formData.data) {
      const token = localStorage.getItem("token");
      setIsFullDayBusy(false);

      fetch(
        `https://localhost:7237/api/Vizitai/uzimti-laikai?gydytojasId=${formData.gydytojasId}&data=${formData.data}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.uzimta === true || data.includes?.("ALL_DAY_BUSY")) {
            setIsFullDayBusy(true);
            setUzimtiLaikai(visiGalimiLaikai);
          } else {
            setUzimtiLaikai(data);
          }
        })
        .catch(() => {
          setUzimtiLaikai([]);
          setIsFullDayBusy(false);
        });
    }
  }, [formData.gydytojasId, formData.data]);

  const patikrintiArLaisva = (laikas) => {
    if (formData.paslaugaIndex === "" || isFullDayBusy) return false;
    const p = paslaugos[parseInt(formData.paslaugaIndex)];
    const blokuSkaicius = p.trukmeMin / 30;
    const pradziosIndex = visiGalimiLaikai.indexOf(laikas);
    if (pradziosIndex + blokuSkaicius > visiGalimiLaikai.length) return false;
    for (let i = 0; i < blokuSkaicius; i++) {
      if (uzimtiLaikai.includes(visiGalimiLaikai[pradziosIndex + i]))
        return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    const galutinisPacientasId =
      (userRole === "Adminas" || userRole === "Gydytojas") &&
      formData.pacientasId
        ? parseInt(formData.pacientasId)
        : parseInt(storedUserId);

    if (!galutinisPacientasId) {
      alert("Klaida: Nepasirinktas pacientas.");
      setLoading(false);
      return;
    }

    const parinktaPaslauga = paslaugos[parseInt(formData.paslaugaIndex)];

    const dto = {
      pacientasId: galutinisPacientasId,
      gydytojasId: parseInt(formData.gydytojasId),
      pradziosLaikas: `${formData.data}T${formData.laikas}:00`,
      trukmeMin: parinktaPaslauga.trukmeMin,
      procedurosPavadinimas: parinktaPaslauga.pavadinimas,
      procedurosKaina: parinktaPaslauga.kaina,
      pastabos:
        userRole === "Adminas" || userRole === "Gydytojas"
          ? "Registruota per darbuotojo sąsają"
          : "Internetinė registracija",
    };

    try {
      const res = await fetch(
        "https://localhost:7237/api/Vizitai/registruotis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dto),
        }
      );

      if (res.ok) {
        alert("Rezervacija sėkmingai sukurta!");
        router.push("/istorija");
      } else {
        const errorMsg = await res.text();
        alert("Klaida: " + errorMsg);
      }
    } catch (err) {
      alert("Sistemos klaida.");
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -150 : 150;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const galiRodytiPaslaugas =
    userRole === "Pacientas" ||
    ((userRole === "Adminas" || userRole === "Gydytojas") &&
      !!formData.pacientasId);

  return (
    <div className="w-100 min-vh-100 bg-light py-4 d-flex flex-column align-items-center">
      <div className="px-3" style={{ width: "90%", maxWidth: "800px" }}>
        <h4 className="fw-bold text-center mb-4 text-dark">
          Registracija vizitui
        </h4>

        {/* 0. PACIENTO PASIRINKIMAS (Tik Admin/Gydytojas) */}
        {(userRole === "Adminas" || userRole === "Gydytojas") && (
          <div className="card shadow-sm border-0 rounded-4 mb-3 bg-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="text-uppercase fw-bold text-muted small d-block mb-0">
                  Pasirinkite pacientą
                </label>

                {formData.pacientasId && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, pacientasId: "" }));
                      setPacientoPaieska("");
                    }}
                  >
                    Keisti
                  </button>
                )}
              </div>

              {formData.pacientasId && pasirinktasPacientas ? (
                <div className="p-3 border-2 border-primary bg-white rounded-4 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">
                      {pasirinktasPacientas.vardas}{" "}
                      {pasirinktasPacientas.pavarde}
                    </div>
                    <div className="small text-muted">
                      {pasirinktasPacientas.elPastas ||
                        pasirinktasPacientas.email}
                    </div>
                  </div>
                  <span className="badge bg-primary text-white rounded-pill">
                    Pacientas parinktas
                  </span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2 rounded-4 mb-3"
                    placeholder="Įveskite vardą, pavardę arba el. paštą"
                    value={pacientoPaieska}
                    onChange={(e) => {
                      setPacientoPaieska(e.target.value);
                      setFormData((prev) => ({ ...prev, pacientasId: "" }));
                    }}
                  />

                  <div style={{ maxHeight: "230px", overflowY: "auto" }}>
                    {filtruotiPacientai.length === 0 ? (
                      <small className="text-muted">
                        Pacientų nerasta. Patikslinkite paiešką.
                      </small>
                    ) : (
                      <>
                        {filtruotiPacientai.slice(0, 5).map((u) => {
                          const isSelected =
                            formData.pacientasId === String(u.id);

                          return (
                            <button
                              key={u.id}
                              type="button"
                              className={`btn w-100 text-start mb-2 rounded-4 py-2 px-3 ${
                                isSelected
                                  ? "btn-primary text-white"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  pacientasId: u.id.toString(),
                                }))
                              }
                            >
                              <div className="fw-semibold">
                                {u.vardas} {u.pavarde}
                              </div>
                              <div className="small text-muted">
                                {u.elPastas || u.email}
                              </div>
                            </button>
                          );
                        })}

                        {filtruotiPacientai.length > 5 && (
                          <small className="text-muted d-block mt-1">
                            Rodomi pirmi 5 rezultatai. Patikslinkite paiešką,
                            kad susiaurintumėte sąrašą.
                          </small>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 1. PASLAUGA – rodom tik jei galima */}
        {galiRodytiPaslaugas && (
          <div className="card shadow-sm border-0 rounded-4 mb-3 overflow-hidden">
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <label className="text-uppercase fw-bold text-muted small">
                1. Pasirinkite paslaugą
              </label>
              {formData.paslaugaIndex !== "" && (
                <button
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      paslaugaIndex: "",
                      gydytojasId: "",
                      laikas: "",
                    })
                  }
                >
                  Keisti
                </button>
              )}
            </div>
            <div className="card-body p-4">
              {formData.paslaugaIndex === "" ? (
                <div className="animate-fade-in">
                  {paslaugos.map((p, idx) => (
                    <div
                      key={p.id}
                      className="d-flex justify-content-between align-items-center p-3 mb-2 border rounded-4 hover-select transition-all cursor-pointer"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          paslaugaIndex: idx.toString(),
                        })
                      }
                    >
                      <div>
                        <div className="fw-bold">{p.pavadinimas}</div>
                        <small className="text-muted">
                          ⏱ {p.trukmeMin} min.
                        </small>
                      </div>
                      <div className="fw-bold text-primary fs-5">
                        {p.kaina} €
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 border-2 border-primary bg-primary bg-opacity-10 rounded-4 d-flex justify-content-between">
                  <span className="fw-bold">
                    {paslaugos[parseInt(formData.paslaugaIndex)].pavadinimas}
                  </span>
                  <span className="badge bg-primary rounded-pill d-flex align-items-center">
                    {paslaugos[parseInt(formData.paslaugaIndex)].kaina} €
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. GYDYTOJAS */}
        {formData.paslaugaIndex !== "" && (
          <div className="card shadow-sm border-0 rounded-4 mb-3 animate-fade-in">
            <div className="card-body p-4">
              <label className="text-uppercase fw-bold text-muted small mb-3 d-block">
                2. Pasirinkite gydytoją
              </label>
              <select
                className="form-select form-select-lg border-2 rounded-4"
                value={formData.gydytojasId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gydytojasId: e.target.value,
                    laikas: "",
                  })
                }
              >
                <option value="">-- Gydytojų sąrašas --</option>
                {filtruotiGydytojai.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.vardas} {g.pavarde}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 3. DATA ir LAIKAS */}
        {formData.gydytojasId && (
          <div className="card shadow-sm border-0 rounded-4 mb-3 animate-fade-in">
            <div className="card-body p-4">
              <label className="text-uppercase fw-bold text-muted small mb-3 d-block">
                3. Pasirinkite datą ir laiką
              </label>

              <div className="d-flex align-items-center gap-2 mb-4">
                <button
                  className="btn btn-light rounded-circle border shadow-sm p-0"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => scroll("left")}
                >
                  ‹
                </button>
                <div
                  ref={scrollRef}
                  className="d-flex gap-2 overflow-auto py-2 no-scrollbar"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {artimiausiosDarboDienos.map((d) => (
                    <div
                      key={d.pilna}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          data: d.pilna,
                          laikas: "",
                        })
                      }
                      className={`d-flex flex-column align-items-center justify-content-center border rounded-4 p-2 flex-shrink-0 transition-all cursor-pointer ${
                        formData.data === d.pilna
                          ? "bg-primary text-white border-primary shadow"
                          : "bg-white text-muted hover-bg-light"
                      }`}
                      style={{ minWidth: "65px", height: "75px" }}
                    >
                      <span className="small fw-bold">
                        {d.savaitėsDiena}
                      </span>
                      <span className="fw-bold fs-5">{d.diena}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-light rounded-circle border shadow-sm p-0"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => scroll("right")}
                >
                  ›
                </button>
              </div>

              {isFullDayBusy ? (
                <div className="alert alert-warning text-center rounded-4 py-4">
                  Šią dieną gydytojas nedirba.
                </div>
              ) : (
                <>
                  <div className="time-grid mb-4">
                    {visiGalimiLaikai.map((t) => {
                      const laisva = patikrintiArLaisva(t);
                      return (
                        <button
                          key={t}
                          disabled={!laisva}
                          className={`btn py-2 fw-bold rounded-3 transition-all ${
                            formData.laikas === t
                              ? "btn-primary shadow"
                              : laisva
                              ? "btn-outline-primary"
                              : "btn-light text-muted opacity-50 border-0"
                          }`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              laikas: t,
                            })
                          }
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-lg mt-2"
                    disabled={!formData.laikas || loading}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      "PATVIRTINTI REZERVACIJĄ"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .time-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (min-width: 500px) {
          .time-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .hover-select:hover {
          background-color: #f8f9fa;
          border-color: #0d6efd !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
