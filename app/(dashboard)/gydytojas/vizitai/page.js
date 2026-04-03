"use client";
import { useEffect, useState } from "react";
import Sidebar from "./kaireDalis";
import AppointmentDetails from "./vidurineDalis";
import PatientHistory from "./desineDalis";
import styles from "./vizitaiPage.module.css";
import API_URL from '@/services/api';

export default function GydytojoValdymas() {
  const [vizitai, setVizitai] = useState([]);
  const [selectedVizitas, setSelectedVizitas] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchManoVizitai(); }, []);

  const fetchManoVizitai = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Vizitai/mano-vizitai`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  if (loading) return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner} />
    </div>
  );

  return (
    <div className={styles.layout}>
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
  );
}
