"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API_URL from '@/services/api';
import { useToast } from "@/context/ToastContext";

export default function Setup2FAPage() {
    return (
        <Suspense fallback={<p>Kraunama...</p>}>
            <SetupContent />
        </Suspense>
    );
}

function SetupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const { success } = useToast();

    const [setupData, setSetupData] = useState(null);
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            setError("Nerastas vartotojo ID.");
            return;
        }

        fetch(`${API_URL}/api/Auth/setup-2fa?userId=${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Nepavyko gauti 2FA nustatymų");
                return res.json();
            })
            .then(data => {
                setSetupData(data);
            })
            .catch(err => {
                setError("Klaida užkraunant nustatymus: " + err.message);
            });
    }, [userId]);

    const handleVerify = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/Auth/verify-2fa?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pin)
            });

            if (res.ok) {
                success("2FA aktyvuotas!", "Prisijunkite iš naujo.");
                router.push("/prisijungti");
            } else {
                const msg = await res.text();
                // VIETOJ white screen, tiesiog įrašome tekstą į error būseną
                setError(msg || "Neteisingas kodas. Bandykite dar kartą.");
            }
        } catch {
            setError("Tinklo klaida. Patikrinkite ryšį su serveriu.");
        } finally {
            setLoading(false);
        }
    };

    if (!setupData && !error) return <div style={{ padding: 40, textAlign: 'center' }}>Kraunama...</div>;

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: 10 }}>Saugumo aktyvavimas</h2>
                <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
                    Nuskenuokite QR kodą programėlėje
                </p>

                {setupData && (
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <img 
                                src={setupData.qrCodeUrl} 
                                alt="QR Code" 
                                style={{ width: 220, border: '4px solid white', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                            />
                        </div>

                        <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                            <small style={{ color: '#666' }}>Rankinis raktas:</small>
                            <div style={{ fontWeight: 'bold', letterSpacing: 2, color: '#0070f3' }}>
                                {setupData.manualEntryKey}
                            </div>
                        </div>
                    </>
                )}

                <div style={{ textAlign: 'left', marginBottom: 20 }}>
                    <p style={{ fontSize: 14, marginBottom: 8, fontWeight: '500' }}>Įveskite 6 skaitmenų kodą:</p>
                    <input
                        type="text"
                        value={pin}
                        onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        placeholder="000000"
                        style={{
                            ...inputStyle,
                            border: error ? '2px solid #ff4d4f' : '1px solid #ddd'
                        }}
                    />

                    {error && (
                        <div style={{ 
                            color: '#d32f2f', 
                            background: '#ffebee', 
                            padding: '10px', 
                            borderRadius: '4px', 
                            fontSize: '14px',
                            marginTop: '-10px',
                            marginBottom: '15px',
                            border: '1px solid #ffcdd2'
                        }}>
                            {error}
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleVerify} 
                    disabled={loading || pin.length !== 6}
                    style={{
                        ...buttonStyle,
                        backgroundColor: loading || pin.length !== 6 ? '#a0a0a0' : '#0070f3'
                    }}
                >
                    {loading ? "Tikrinama..." : "Patvirtinti"}
                </button>
                
                <button 
                    onClick={() => router.push('/prisijungti')}
                    style={{ background: 'none', border: 'none', marginTop: 15, color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Atšaukti
                </button>
            </div>
        </div>
    );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' };
const cardStyle = { padding: 40, border: '1px solid #ddd', borderRadius: 12, textAlign: 'center', width: 400, background: '#fff' };
const inputStyle = { width: '100%', padding: 12, fontSize: 18, textAlign: 'center', marginBottom: 15, borderRadius: 6 };
const buttonStyle = { width: '100%', padding: 12, color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' };