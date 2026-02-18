"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGydytojai() {
  const router = useRouter(); // Navigacijai
  
  const [formData, setFormData] = useState({
    vardas: '',
    pavarde: '',
    asmensKodas: '',
    elPastas: '',
    slaptazodis: '',
    telefonas: '',
    amzius: 0,
    kraujoGrupe: '',
    specializacija: '',
    darboPatirtisMetais: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch('https://localhost:7237/api/Gydytojai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          amzius: parseInt(formData.amzius),
          darboPatirtisMetais: parseInt(formData.darboPatirtisMetais)
        })
      });

      if (res.ok) {
        alert("Gydytojas sėkmingai pridėtas!");
        router.push("/vartotojai"); // Po sėkmingo kūrimo grįžtame į sąrašą
      } else {
        const errorData = await res.json();
        alert("Klaida: " + (errorData.message || "Patikrinkite duomenis"));
      }
    } catch (err) {
      alert("Nepavyko susisiekti su serveriu.");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Navigacijos viršus */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button 
          onClick={() => router.back()} 
          style={backBtnStyle}
          title="Grįžti atgal"
        >
          ←
        </button>
        <h2 style={{ margin: 0 }}>Pridėti naują gydytoją</h2>
      </div>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <h4 style={{ marginBottom: '20px', color: '#1e293b borderBottom: 1px solid #eee', paddingBottom: '10px' }}>
          Sistemos paskyros duomenys
        </h4>

        <div style={inputGrid}>
          <div style={inputGroup}>
            <label style={labelStyle}>Vardas</label>
            <input type="text" value={formData.vardas} onChange={e => setFormData({...formData, vardas: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Pavardė</label>
            <input type="text" value={formData.pavarde} onChange={e => setFormData({...formData, pavarde: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Asmens kodas</label>
            <input type="text" value={formData.asmensKodas} onChange={e => setFormData({...formData, asmensKodas: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Amžius</label>
            <input type="number" value={formData.amzius} onChange={e => setFormData({...formData, amzius: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Specializacija</label>
            <select value={formData.specializacija} onChange={e => setFormData({...formData, specializacija: e.target.value})} required style={inputStyle}>
              <option value="">Pasirinkite...</option>
              <option value="Gydytojas odontologas">Gydytojas odontologas</option>
              <option value="Burnos chirurgas">Burnos chirurgas</option>
              <option value="Endodontas">Endodontas</option>
              <option value="Burnos higienistas">Burnos higienistas</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Patirtis (metais)</label>
            <input type="number" value={formData.darboPatirtisMetais} onChange={e => setFormData({...formData, darboPatirtisMetais: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>El. paštas</label>
            <input type="email" value={formData.elPastas} onChange={e => setFormData({...formData, elPastas: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Laikinas slaptažodis</label>
            <input type="password" value={formData.slaptazodis} onChange={e => setFormData({...formData, slaptazodis: e.target.value})} required style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={btnStyle}>Sukurti gydytojo paskyrą</button>
          <button 
            type="button" 
            onClick={() => router.push('/vartotojai')} 
            style={cancelBtnStyle}
          >
            Atšaukti
          </button>
        </div>
      </form>
    </div>
  );
}

// Patobulinti stiliai
const formStyle = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' };
const inputGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' };

const backBtnStyle = { 
  width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0', 
  background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', fontSize: '20px', color: '#64748b', transition: 'all 0.2s'
};

const btnStyle = { flex: 2, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const cancelBtnStyle = { flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };