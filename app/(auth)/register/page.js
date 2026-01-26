"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    vardas: '', pavarde: '', asmensKodas: '', elPastas: '',
    slaptazodis: '', telefonas: '', amzius: 0
  });
  
  // 1. Sukuriame isLoading būseną
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/rezervacija");
    } else {
      // Tik jei žetono nėra, išjungiam krovimą
      setIsLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://localhost:7237/api/Auth/registracija', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Registracija sėkminga! Dabar galite prisijungti.");
      router.push('/login');
    } else {
      alert("Klaida registruojantis.");
    }
  };

  // 2. Patikrinimą iškeliame į viršų, prieš pagrindinį return
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Kraunama...</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Registracija</h2>
        
        <input placeholder="Vardas" onChange={e => setFormData({...formData, vardas: e.target.value})} className="border p-2 rounded" required />
        <input placeholder="Pavardė" onChange={e => setFormData({...formData, pavarde: e.target.value})} className="border p-2 rounded" required />
        <input placeholder="Asmens Kodas" onChange={e => setFormData({...formData, asmensKodas: e.target.value})} className="border p-2 rounded" required />
        <input type="email" placeholder="El. paštas" onChange={e => setFormData({...formData, elPastas: e.target.value})} className="border p-2 rounded" required />
        <input type="password" placeholder="Slaptažodis" onChange={e => setFormData({...formData, slaptazodis: e.target.value})} className="border p-2 rounded" required />
        <input placeholder="Telefonas" onChange={e => setFormData({...formData, telefonas: e.target.value})} className="border p-2 rounded" />
        <input type="number" placeholder="Amžius" onChange={e => setFormData({...formData, amzius: parseInt(e.target.value)})} className="border p-2 rounded" />
        
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-2 rounded font-bold transition">
          Registruotis
        </button>

        <div className="text-center mt-4 text-sm">
          <span>Jau turite paskyrą? </span>
          <Link href="/login" className="text-blue-600 font-bold hover:underline">Prisijungti</Link>
        </div>
      </form>
    </div>
  );
}