"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from '../prisijungti/login.module.css';
import API_URL from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/Auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elPastas: email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Klaida. Bandykite vėliau.');
      }
    } catch {
      setError('Nepavyko susisiekti su serveriu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {!sent ? (
          <>
            <h1 className={styles.authTitle}>Pamiršote slaptažodį?</h1>
            <p className={styles.authSubtitle}>
              Įveskite el. paštą — atsiųsime nuorodą slaptažodžiui atstatyti
            </p>

            <form onSubmit={handleSubmit} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">El. paštas</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vardas@example.com"
                  required
                />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Siunčiama...' : 'Siųsti nuorodą'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: 64, height: 64,
              background: '#f0fdf4',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 20px',
              border: '2px solid #bbf7d0'
            }}>
              ✓
            </div>
            <h2 className={styles.tfaTitle}>Laiškas išsiųstas!</h2>
            <p className={styles.tfaDescription}>
              Patikrinkite savo el. paštą <strong>{email}</strong>.<br />
              Nuoroda slaptažodžiui atstatyti galioja 1 valandą.
            </p>
          </div>
        )}

        <div className={styles.authFooter}>
          <p>
            <Link href="/prisijungti" className={styles.authLink}>
              ← Grįžti į prisijungimą
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
