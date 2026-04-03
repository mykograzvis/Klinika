"use client";
import { useEffect, useState, useMemo } from "react";
import API_URL from '@/services/api';

export default function AdminAnalize() {
  const dabar = new Date();
  const [filtras, setFiltras] = useState({
    metai: dabar.getFullYear(),
    menesis: dabar.getMonth() + 1,
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalize();
  }, [filtras]);

  const fetchAnalize = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/Statistika/analize?metai=${filtras.metai}&menesis=${filtras.menesis}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error("Tinklo klaida:", err);
    } finally {
      setLoading(false);
    }
  };

  const eksportuotiIExcel = () => {
    if (!data) return;
    const header = "\uFEFFGydytojas;Vizitai;Pajamos";
    const rows = data.gydytojuEfektyvumas.map(
      (g) => `${g.vardas};${g.vizitai};${g.pajamos}`
    );
    const csvRows = [header, ...rows];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Klinikos_Ataskaita_${filtras.metai}_${filtras.menesis}.csv`;
    a.click();
  };

  const stats = useMemo(() => {
    if (!data) {
      return {
        totalVisits: 0,
        avgPerVisit: 0,
      };
    }

    const totalVisits = data.gydytojuEfektyvumas.reduce(
      (sum, g) => sum + g.vizitai,
      0
    );
    // bendraSuma backend'e turi skaičiuoti TIK "Apmokėta" vizitus
    const avgPerVisit =
      totalVisits > 0 ? data.bendraSuma / totalVisits : 0;

    return { totalVisits, avgPerVisit };
  }, [data]);

  if (loading && !data) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <div className="text-muted">Kraunama statistika...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 min-vh-100 bg-light py-4 d-flex flex-column align-items-center">
      <div className="container" style={{ maxWidth: "1150px" }}>
        {/* HEADER */}
        <header className="mb-4 pb-3 border-bottom">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h2 className="fw-bold text-dark mb-1">Finansinė analizė</h2>
              <p className="text-muted mb-0">
                Vizitų ir pajamų statistika pasirinktam mėnesiui.
              </p>
            </div>

            <div className="card border-0 shadow-sm bg-white">
              <div className="card-body py-2 px-3 d-flex gap-2 align-items-center">
                <select
                  className="form-select form-select-sm"
                  style={{ minWidth: 140 }}
                  value={filtras.menesis}
                  onChange={(e) =>
                    setFiltras({
                      ...filtras,
                      menesis: parseInt(e.target.value, 10),
                    })
                  }
                >
                  {[
                    "Sausis",
                    "Vasaris",
                    "Kovas",
                    "Balandis",
                    "Gegužė",
                    "Birželis",
                    "Liepa",
                    "Rugpjūtis",
                    "Rugsėjis",
                    "Spalis",
                    "Lapkritis",
                    "Gruodis",
                  ].map((m, i) => (
                    <option key={i + 1} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-control form-control-sm"
                  style={{ width: 90 }}
                  value={filtras.metai}
                  onChange={(e) =>
                    setFiltras({
                      ...filtras,
                      metai: parseInt(e.target.value, 10),
                    })
                  }
                />

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={eksportuotiIExcel}
                >
                  Eksportuoti CSV
                </button>
              </div>
            </div>
          </div>
        </header>

        {!data && (
          <section className="text-center py-5">
            <h4 className="text-muted mb-2">
              Nėra duomenų pasirinktam laikotarpiui.
            </h4>
            <p className="text-muted mb-0">
              Pabandykite pakeisti mėnesį arba metus.
            </p>
          </section>
        )}

        {data && (
          <>
            {/* 1. APŽVALGA */}
            <section className="mb-4">
              <h6 className="text-uppercase text-muted small mb-2">
                Apžvalga
              </h6>
              <div className="row g-3">
                {/* Bendra apyvarta — tik Apmokėta vizitai */}
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Gautos pajamos
                      </div>
                      <div className="h4 fw-bold mb-0">
                        {data.bendraSuma.toLocaleString()} €
                      </div>
                      <div className="small text-muted">
                        Tik apmokėti vizitai
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vizitų skaičius */}
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Vizitų skaičius
                      </div>
                      <div className="h4 fw-bold mb-0">
                        {stats.totalVisits}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unikalūs pacientai */}
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Unikalūs pacientai
                      </div>
                      <div className="h4 fw-bold mb-0">
                        {data.pacientuSkaicius}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vidutinė suma vizitui */}
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm h-100 ">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Vidutinė suma vizitui
                      </div>
                      <div className="h4 fw-bold mb-0">
                        {stats.avgPerVisit.toFixed(2)} €
                      </div>
                      <div className="small text-muted">
                        Pajamos vienam vizitui
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="my-4" />

            {/* 2. NEAPMOKĖTI VIZITAI */}
            <section className="mb-4">
              <h6 className="text-uppercase text-muted small mb-2">
                Neapmokėti vizitai
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Neapmokėtų vizitų skaičius
                      </div>
                      <div className="h4 fw-bold mb-0 text-warning">
                        {data.neapmoketi?.skaicius ?? 0}
                      </div>
                      <div className="small text-muted">
                        Atlikti, bet dar neapmokėti
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Neapmokėta suma
                      </div>
                      <div className="h4 fw-bold mb-0 text-danger">
                        {(data.neapmoketi?.suma ?? 0).toLocaleString()} €
                      </div>
                      <div className="small text-muted">
                        Laukiama apmokėjimo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Procentas nuo visos potencialios apyvartos */}
                {(data.neapmoketi?.suma ?? 0) > 0 && (
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-muted small mb-2">
                          Neapmokėta dalis nuo visos apyvartos
                        </div>
                        {(() => {
                          const viso = data.bendraSuma;
                          const proc = viso > 0 ? ((data.neapmoketi.suma / viso) * 100) : 0;
                          return (
                            <>
                              <div className="h4 fw-bold mb-1">
                                {proc.toFixed(1)}%
                              </div>
                              <div className="progress" style={{ height: "6px" }}>
                                <div
                                  className="progress-bar bg-danger"
                                  role="progressbar"
                                  style={{ width: `${Math.min(proc, 100).toFixed(1)}%` }}
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <hr className="my-4" />

            {/* 3. GYDYTOJŲ NAŠUMAS + TOP PASLAUGOS */}
            <section className="mb-3">
              <div className="row g-4">
                {/* Gydytojų lentelė */}
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase text-muted small mb-0">
                          Gydytojų našumas
                        </h6>
                        <span className="text-muted small">
                          Gydytojų: {data.gydytojuEfektyvumas.length}
                        </span>
                      </div>

                      <div className="table-responsive mb-3">
                        <table className="table table-sm align-middle mb-0">
                          <thead className="table-light">
                            <tr className="small text-muted text-uppercase">
                              <th style={{ width: "40%" }}>Gydytojas</th>
                              <th className="text-center" style={{ width: "10%" }}>
                                Vizitai
                              </th>
                              <th className="text-end" style={{ width: "20%" }}>
                                Suma
                              </th>
                              <th className="text-end" style={{ width: "15%" }}>
                                Apyvartos %
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.gydytojuEfektyvumas.map((g, i) => {
                              const procentas =
                                data.bendraSuma > 0
                                  ? (g.pajamos / data.bendraSuma) * 100
                                  : 0;
                              return (
                                <tr key={i}>
                                  <td>
                                    <div className="fw-semibold">{g.vardas}</div>
                                    <div className="progress mt-1" style={{ height: "4px" }}>
                                      <div
                                        className="progress-bar bg-primary"
                                        role="progressbar"
                                        style={{
                                          width: `${Math.min(procentas, 100).toFixed(1)}%`,
                                        }}
                                      />
                                    </div>
                                  </td>
                                  <td className="text-center">{g.vizitai}</td>
                                  <td className="text-end">
                                    {g.pajamos.toLocaleString()} €
                                  </td>
                                  <td className="text-end">
                                    {procentas.toFixed(1)}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {data.gydytojuEfektyvumas.length === 0 && (
                        <p className="text-muted small mb-0">
                          Šiame laikotarpyje nėra gydytojų vizitų.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top paslaugos */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <h6 className="text-uppercase text-muted small mb-3">
                        Top paslaugos
                      </h6>

                      {data.topProceduros.length === 0 && (
                        <p className="text-muted mb-0">
                          Šį mėnesį procedūrų neatlikta.
                        </p>
                      )}

                      {data.topProceduros.length > 0 && (
                        <div
                          className="small"
                          style={{ maxHeight: 260, overflowY: "auto" }}
                        >
                          {data.topProceduros.map((p, i) => {
                            const procentas =
                              data.bendraSuma > 0
                                ? (p.suma / data.bendraSuma) * 100
                                : 0;
                            return (
                              <div key={i} className="mb-3 pb-2 border-bottom">
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="fw-semibold">{p.pavadinimas}</span>
                                  <span className="fw-bold">
                                    {p.suma.toLocaleString()} €
                                  </span>
                                </div>
                                <div
                                  className="progress bg-light"
                                  style={{ height: "6px" }}
                                >
                                  <div
                                    className="progress-bar bg-info"
                                    role="progressbar"
                                    style={{
                                      width: `${Math.min(procentas, 100).toFixed(1)}%`,
                                    }}
                                  />
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                  <span className="text-muted">
                                    {p.kiekis} kartai (-ų)
                                  </span>
                                  <span className="text-muted">
                                    {procentas.toFixed(1)}% apyvartos
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}