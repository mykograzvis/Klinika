"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "./style.module.css";

export default function DashboardLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.replace("/prisijungimas");
  } else {
    setIsAuthorized(true);
  }
}, []);

  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
        <h3 style={{ marginLeft: '15px' }}>Tikrinama autorizacija...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '40px', background: '#f8fafc' }}>
        {children}
      </main>
    </div>
  );
}