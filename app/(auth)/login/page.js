"use client"; 

// 1. Pridėtas useEffect importas
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Krovimosi būsena
  const router = useRouter();

  // 2. useEffect perkeltas į tinkamą vietą (komponento viršuje)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/rezervacija");
    } else {
      setIsLoading(false); // Tik jei nėra tokeno, leidžiame matyti formą
    }
  }, [router]);

  // 3. handleLogin dabar yra švari funkcija
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://localhost:7237/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elPastas: email,
          slaptazodis: password
        })
      });

      if (response.ok) {
          // Svarbu: naudojame .json(), nes serveris dabar siunčia { token, role... }
          const data = await response.json(); 
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role); 
          
          // Papildomai galime išsisaugoti vardą pasisveikinimui
          localStorage.setItem('userName', data.vardas);
          localStorage.setItem('userId', data.userId);

          router.push('/rezervacija'); 
      } else {
        const errorMsg = await response.text();
        setError(errorMsg || "Neteisingi prisijungimo duomenys");
      }
    } catch (err) {
      setError("Nepavyko susisiekti su serveriu.");
    }
  };

  // Jei tikriname tokeną, rodome krovimąsi
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Kraunama...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Prisijungimas</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input 
          type="email" 
          placeholder="El. paštas" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          style={{ padding: '8px' }}
        />
        
        <input 
          type="password" 
          placeholder="Slaptažodis" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          style={{ padding: '8px' }}
        />
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Prisijunkite
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#64748b' }}>Neturite paskyros? </span>
          <Link href="/register" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>
            Užsiregistruokite
          </Link>
        </div>
      </form>
    </div>
  );
}