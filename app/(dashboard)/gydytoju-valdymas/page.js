"use client";
import { useState } from 'react';

export default function AdminGydytojai() {
  // Pridėti visi trūkstami laukai, kurių reikalauja tavo DTO
  const [formData, setFormData] = useState({
    vardas: '',
    pavarde: '',
    asmensKodas: '', // NAUJAS
    elPastas: '',
    slaptazodis: '',
    telefonas: '',
    amzius: 0, // NAUJAS
    kraujoGrupe: '', // NAUJAS
    specializacija: '',
    darboPatirtisMetais: 0 // NAUJAS
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
        // Svarbu užtikrinti, kad skaičiai būtų siunčiami kaip skaičiai, o ne tekstas
        body: JSON.stringify({
          ...formData,
          amzius: parseInt(formData.amzius),
          darboPatirtisMetais: parseInt(formData.darboPatirtisMetais)
        })
      });

      if (res.ok) {
        alert("Gydytojas sėkmingai pridėtas!");
        // Reset forma
        setFormData({
          vardas: '', pavarde: '', asmensKodas: '', elPastas: '',
          slaptazodis: '', telefonas: '', amzius: 0,
          kraujoGrupe: '', specializacija: '', darboPatirtisMetais: 0
        });
      } else {
        const errorData = await res.json();
        console.error("Serverio klaida:", errorData);
        alert("Klaida: " + (errorData.message || "Patikrinkite duomenis"));
      }
    } catch (err) {
      alert("Nepavyko susisiekti su serveriu.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Pridėti naują gydytoją</h2>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGrid}>
          <div style={inputGroup}>
            <label>Vardas</label>
            <input type="text" value={formData.vardas} onChange={e => setFormData({...formData, vardas: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Pavardė</label>
            <input type="text" value={formData.pavarde} onChange={e => setFormData({...formData, pavarde: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Asmens kodas</label>
            <input type="text" value={formData.asmensKodas} onChange={e => setFormData({...formData, asmensKodas: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Amžius</label>
            <input type="number" value={formData.amzius} onChange={e => setFormData({...formData, amzius: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Specializacija</label>
            <select value={formData.specializacija} onChange={e => setFormData({...formData, specializacija: e.target.value})} required style={inputStyle}>
              <option value="">Pasirinkite...</option>
              <option value="Gydytojas odontologas">Gydytojas odontologas</option>
              <option value="Burnos chirurgas">Burnos chirurgas</option>
              <option value="Ortodontas">Ortodontas</option>
              <option value="Burnos higienistas">Burnos higienistas</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label>Patirtis (metais)</label>
            <input type="number" value={formData.darboPatirtisMetais} onChange={e => setFormData({...formData, darboPatirtisMetais: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>El. paštas</label>
            <input type="email" value={formData.elPastas} onChange={e => setFormData({...formData, elPastas: e.target.value})} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Laikinas slaptažodis</label>
            <input type="password" value={formData.slaptazodis} onChange={e => setFormData({...formData, slaptazodis: e.target.value})} required style={inputStyle} />
          </div>
        </div>

        <button type="submit" style={btnStyle}>Sukurti gydytojo paskyrą</button>
      </form>
    </div>
  );
}

// Stiliai (papildyti šiek tiek geresniam išdėstymui)
const formStyle = { background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const inputGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginTop: '5px' };
const btnStyle = { padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' };