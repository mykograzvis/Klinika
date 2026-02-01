"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Naudosime automatiškam uždarymui paspaudus nuorodą
  const [role, setRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Sidebar būsena mobiliajame

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setIsOpen(false); // Uždaryti sidebar pasikeitus puslapiui
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      {/* MOBILUS MYGTUKAS (Hamburger) - Matomas tik mažuose ekranuose */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={mobileToggleStyle}
        className="d-md-none"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* SIDEBAR */}
      <nav style={{ 
        ...sidebarStyle, 
        left: isOpen ? "0" : "-250px", // Valdome išvažiavimą mobiliajame
      }} className="sidebar-nav">
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Gelmidenta</h2>
        
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          <li style={liStyle}><Link href="/rezervacija" style={linkStyle}>🦷 Rezervacija</Link></li>
          <li style={liStyle}><Link href="/istorija" style={linkStyle}>📜 Istorija</Link></li>
          <li style={liStyle}><Link href="/profilis" style={linkStyle}>👤 Profilis</Link></li>

          {/* VIZITŲ VALDYMAS (Pataisyta logika) */}
          {(role === "Adminas" || role === "Gydytojas") && (
            <>
              <hr style={hrStyle} />
              <li style={liStyle}>
                <Link href="/gydytojas/vizitai" style={adminLinkStyle}>👨‍⚕️ Vizitų valdymas</Link>
              </li>
            </>
          )}

          {/* ADMINO NUORODOS */}
          {role === "Adminas" && (
            <>
              <hr style={hrStyle} />
              <li style={liStyle}><Link href="/vartotojai" style={adminLinkStyle}>👥 Vartotojų valdymas</Link></li>
              <li style={liStyle}><Link href="/statistika" style={adminLinkStyle}>📊 Statistika</Link></li>
            </>
          )}
        </ul>
        
        <button onClick={handleLogout} style={logoutBtnStyle}>
          Atsijungti
        </button>
      </nav>

      {/* FONAS (Overlay) - užsidaro paspaudus bet kur šalia sidebar (tik mobiliajame) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          style={overlayStyle}
          className="d-md-none"
        />
      )}

      {/* Papildomas CSS responsyvumui */}
      <style jsx>{`
        @media (min-width: 768px) {
          .sidebar-nav {
            left: 0 !important;
            position: sticky !important;
            height: 100vh;
          }
        }
      `}</style>
    </>
  );
}

// STILIAI
const sidebarStyle = {
  width: '250px',
  background: '#1e293b',
  color: 'white',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed', // Svarbu mobiliajam
  top: 0,
  bottom: 0,
  transition: '0.3s ease',
  zIndex: 1050,
};

const mobileToggleStyle = {
  position: 'fixed',
  top: '15px',
  left: '15px',
  zIndex: 1100,
  background: '#1e293b',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  fontSize: '20px',
  cursor: 'pointer'
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  zIndex: 1040
};

const liStyle = { marginBottom: '15px' };
const linkStyle = { color: 'white', textDecoration: 'none', display: 'block', padding: '8px', borderRadius: '4px' };
const adminLinkStyle = { ...linkStyle, color: '#93c5fd', fontWeight: 'bold' };
const hrStyle = { borderColor: '#334155', margin: '15px 0' };
const logoutBtnStyle = { 
  marginTop: 'auto', 
  background: '#ef4444', 
  color: 'white', 
  border: 'none', 
  padding: '12px', 
  width: '100%', 
  borderRadius: '5px', 
  cursor: 'pointer',
  fontWeight: 'bold'
};