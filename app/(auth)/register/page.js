"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    vardas: '', pavarde: '', asmensKodas: '', elPastas: '',
    slaptazodis: '', telefonas: '', amzius: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/rezervacija");
    else setIsLoading(false);
  }, [router]);

  const handleInvalid = (e, message) => {
    e.target.setCustomValidity(message);
  };

  const handleInput = (e) => {
    e.target.setCustomValidity(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://localhost:7237/api/Auth/registracija', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Registracija sėkminga!");
      router.push('/login');
    } else {
      alert("Klaida registruojantis. Patikrinkite duomenis.");
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h3>Kraunama...</h3></div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Registracija</h2>
          
          <input 
            placeholder="Vardas" 
            onChange={e => setFormData({...formData, vardas: e.target.value})} 
            onInvalid={(e) => handleInvalid(e, "Įveskite vardą")}
            onInput={handleInput}
            required 
            style={inputStyle} 
          />
          
          <input 
            placeholder="Pavardė" 
            onChange={e => setFormData({...formData, pavarde: e.target.value})} 
            onInvalid={(e) => handleInvalid(e, "Įveskite pavardę")}
            onInput={handleInput}
            required 
            style={inputStyle} 
          />
          
          <input 
            placeholder="Asmens kodas" 
            onChange={e => setFormData({...formData, asmensKodas: e.target.value})} 
            onInvalid={(e) => handleInvalid(e, "Įveskite asmens kodą")}
            onInput={handleInput}
            required 
            style={inputStyle} 
          />
          
          <input 
            type="email" 
            placeholder="El. paštas" 
            onChange={e => setFormData({...formData, elPastas: e.target.value})} 
            onInvalid={(e) => handleInvalid(e, "Įveskite el. paštą")}
            onInput={handleInput}
            required 
            style={inputStyle} 
          />
          
          <input 
            type="password" 
            placeholder="Slaptažodis" 
            onChange={e => setFormData({...formData, slaptazodis: e.target.value})} 
            onInvalid={(e) => handleInvalid(e, "Įveskite slaptažodį")}
            onInput={handleInput}
            required 
            style={inputStyle} 
          />
          
          <input 
            placeholder="Telefonas" 
            onChange={e => setFormData({...formData, telefonas: e.target.value})} 
            onInvalid={(e) => handleInvalid(e, "Įveskite telefono numerį")}
            onInput={handleInput}
            required 
            style={inputStyle} 
          />
          
          <input 
            type="number" 
            placeholder="Amžius" 
            onChange={e => setFormData({...formData, amzius: parseInt(e.target.value) || 0})} 
            onInvalid={(e) => handleInvalid(e, "Nurodykite amžių")}
            onInput={handleInput}
            required 
            style={inputStyle} 
          />

          <button type="submit" style={btnStyle}>Registruotis</button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#64748b' }}>Jau turite paskyrą? </span>
          <Link href="/login" style={{ color: '#0070f3', fontWeight: 'bold', textDecoration: 'none' }}>Prisijunkite</Link>
        </div>
      </div>
    </div>
  );
}

// Stiliaus objektai, kad kodas būtų tvarkingas
const inputStyle = { 
  padding: '8px', 
  border: '1px solid #ccc', 
  borderRadius: '4px', 
  outline: 'none' 
};

const btnStyle = { 
  padding: '10px', 
  backgroundColor: '#0070f3', 
  color: 'white', 
  border: 'none', 
  cursor: 'pointer', 
  borderRadius: '4px',
  fontWeight: 'bold',
  marginTop: '5px'
};