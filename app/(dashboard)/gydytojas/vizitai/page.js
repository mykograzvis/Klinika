"use client";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "./kaireDalis";
import AppointmentDetails from "./vidurineDalis";
import PatientHistory from "./desineDalis";

export default function GydytojoValdymas() {
  const [vizitai, setVizitai] = useState([]);
  const [selectedVizitas, setSelectedVizitas] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchManoVizitai(); }, []);

  const fetchManoVizitai = async () => {
    try {
      const res = await fetch("https://localhost:7237/api/Vizitai/mano-vizitai", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVizitai(data);
        if (selectedVizitas) {
          const atnaujintas = data.find(v => v.id === selectedVizitas.id);
          if (atnaujintas) setSelectedVizitas(atnaujintas);
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center fw-bold text-primary">KRAUNAMA SISTEMA...</div>;

  return (
    <div className="container-fluid vh-100 p-0 bg-light overflow-hidden">
      <div className="row g-0 h-100">
        <Sidebar 
          vizitai={vizitai} 
          selectedVizitas={selectedVizitas} 
          setSelectedVizitas={setSelectedVizitas}
          viewDate={viewDate}
          setViewDate={setViewDate}
        />
        <AppointmentDetails 
          selectedVizitas={selectedVizitas} 
          fetchManoVizitai={fetchManoVizitai} 
        />
        <PatientHistory 
          selectedVizitas={selectedVizitas} 
          visiVizitai={vizitai} 
        />
      </div>

      <style jsx global>{`
        .small-calendar { border: none !important; width: 100% !important; font-size: 0.82rem; padding: 5px; }
        .react-calendar__tile--active { background: #0d6efd !important; border-radius: 8px !important; color: white !important; }
        .react-calendar__tile--now { background: #f0f7ff !important; color: #0d6efd !important; font-weight: bold; border-radius: 8px; }
        .has-appointment { position: relative; font-weight: bold !important; color: #0d6efd !important; }
        .has-appointment::after { content: '●'; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); font-size: 8px; color: #0d6efd; }
        .hover-card:hover { transform: translateX(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.05) !important; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media print {
          .no-print { display: none !important; }
          .printable-area { width: 100% !important; position: absolute; left: 0; top: 0; }
        }
      `}</style>
    </div>
  );
}