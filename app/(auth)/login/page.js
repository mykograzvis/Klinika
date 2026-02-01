"use client";

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1); 
  const [tempUserId, setTempUserId] = useState(null); 
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/rezervacija");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleInvalid = (e, message) => {
    e.target.setCustomValidity(message);
  };

  const handleInput = (e) => {
    e.target.setCustomValidity(""); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://localhost:7237/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elPastas: email, slaptazodis: password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Neteisingi duomenys");
        return;
      }

      const data = await response.json();

      if (data.mustSetup2FA) {
        router.push(`/setup-2fa?userId=${data.userId}`);
        return;
      }
      if (data.requiresTwoFactor) {
        setTempUserId(data.userId);
        setStep(2);
        return;
      }
      loginSuccess(data);
    } catch (err) {
      setError("Nepavyko susisiekti su serveriu.");
    }
  };

  const handle2FAVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7237/api/Auth/login-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tempUserId, code: twoFactorCode })
      });

      if (response.ok) {
        const data = await response.json();
        loginSuccess(data);
      } else {
        setError("Neteisingas 2FA kodas.");
      }
    } catch (err) {
      setError("Klaida tikrinant 2FA.");
    }
  };

  const loginSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userName', data.vardas);
    localStorage.setItem('userId', data.userId);
    router.push('/rezervacija');
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}><h3>Kraunama...</h3></div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        
        {step === 1 ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>Prisijungimas</h2>
            {error && <p style={{ color: 'red', fontSize: '13px', margin: '0 0 10px 0', fontWeight: 'bold' }}>{error}</p>}
            
            <input 
              type="email" 
              placeholder="El. paštas" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onInvalid={(e) => handleInvalid(e, "Prašome įvesti el. pašto adresą")}
              onInput={handleInput}
              required 
              style={inputStyle} 
            />
            
            <input 
              type="password" 
              placeholder="Slaptažodis" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onInvalid={(e) => handleInvalid(e, "Prašome įvesti slaptažodį")}
              onInput={handleInput}
              required 
              style={inputStyle} 
            />
            
            <button type="submit" style={btnStyle}>Prisijungti</button>
          </form>
        ) : (
          <form onSubmit={handle2FAVerify} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>Saugumo kodas</h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>Įveskite 6 skaitmenų kodą</p>
            {error && <p style={{ color: 'red', fontSize: '13px', fontWeight: 'bold' }}>{error}</p>}
            
            <input 
              type="text" 
              placeholder="000000" 
              value={twoFactorCode} 
              onChange={(e) => setTwoFactorCode(e.target.value)} 
              onInvalid={(e) => handleInvalid(e, "Įveskite 6 skaitmenų kodą")}
              onInput={handleInput}
              required 
              maxLength={6}
              style={{ ...inputStyle, textAlign: 'center', fontSize: '20px', letterSpacing: '5px' }} 
            />
            
            <button type="submit" style={btnStyle}>Patvirtinti</button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', fontSize: '13px' }}>Atgal</button>
          </form>
        )}

        {step === 1 && (
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            <span style={{ color: '#64748b' }}>Neturite paskyros? </span>
            <Link href="/register" style={{ color: '#0070f3', fontWeight: 'bold', textDecoration: 'none' }}>Užsiregistruokite</Link>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' };
const btnStyle = { padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' };