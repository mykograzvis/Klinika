"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Paimame rolę tik tada, kai komponentas užsikrauna kliente
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav style={{ width: '250px', background: '#1e293b', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '30px' }}>Gelmidenta</h2>
      
      <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
        <li style={{ marginBottom: '15px' }}>
          <Link href="/rezervacija" style={linkStyle}>🦷 Rezervacija</Link>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Link href="/istorija" style={linkStyle}>📜 Istorija</Link>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Link href="/profilis" style={linkStyle}>👤 Profilis</Link>
        </li>

        {role === "Adminas" || role === "Gydytojas" && (
          <>
            <hr style={{ borderColor: '#334155', margin: '20px 0' }} />
            <li style={{ marginBottom: '15px' }}>
              <Link href="/gydytojas/vizitai" style={adminLinkStyle}>👨‍⚕️ Vizitu valdymas</Link>
            </li>
          </>
        )}

        {/* ADMINO NUORODOS */}
        {role === "Adminas" && (
          <>
            <hr style={{ borderColor: '#334155', margin: '20px 0' }} />
            <li style={{ marginBottom: '15px' }}>
              <Link href="/gydytoju-valdymas" style={adminLinkStyle}>👨‍⚕️ Valdyti gydytojus</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link href="/vartotojai" style={adminLinkStyle}>👥 Vartotojų sąrašas</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link href="/statistika" style={adminLinkStyle}>📊 Statistika</Link>
            </li>
          </>
        )}
      </ul>
      
      <button onClick={handleLogout} style={logoutBtnStyle}>
        Atsijungti
      </button>
    </nav>
  );
}

// Stiliai, kad nebūtų „šiukšlių“ pagrindiniame kode
const linkStyle = { color: 'white', textDecoration: 'none', display: 'block' };
const adminLinkStyle = { ...linkStyle, color: '#93c5fd', fontWeight: 'bold' };
const logoutBtnStyle = { 
  marginTop: 'auto', 
  background: '#ef4444', 
  color: 'white', 
  border: 'none', 
  padding: '10px', 
  width: '100%', 
  borderRadius: '5px', 
  cursor: 'pointer' 
};