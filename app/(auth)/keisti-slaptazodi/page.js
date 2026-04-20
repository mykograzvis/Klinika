"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../prisijungti/login.module.css';
import API_URL from '@/services/api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Trūksta arba neteisingas atstatymo raktas. Prašykite naujos nuorodos.');
    }
  }, [token]);

  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strengthInfo = [
    { label: '', color: '#e2e8f0' },
    { label: 'Silpnas', color: '#ef4444' },
    { label: 'Vidutinis', color: '#f97316' },
    { label: 'Stiprus', color: '#22c55e' },
  ];

  const strength = getStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Slaptažodis turi būti bent 6 simbolių.');
      return;
    }
    if (password !== confirm) {
      setError('Slaptažodžiai nesutampa.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, naujasSlaptazodis: password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/prisijungti'), 3000);
      } else {
        setError(data.message || 'Nuoroda negaliojanti arba pasibaigė galiojimo laikas.');
      }
    } catch {
      setError('Nepavyko susisiekti su serveriu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
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
            <h2 className={styles.tfaTitle}>Slaptažodis pakeistas!</h2>
            <p className={styles.tfaDescription}>
              Jūsų slaptažodis sėkmingai atnaujintas.<br />
              Nukreipiama į prisijungimą...
            </p>
            <div className={styles.loadingSpinner} style={{ margin: '20px auto 0' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Naujas slaptažodis</h1>
        <p className={styles.authSubtitle}>Įveskite naują slaptažodį savo paskyrai</p>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Naujas slaptažodis</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Bent 6 simboliai"
                required
                style={{ paddingRight: '48px', width: '100%', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '18px', color: '#94a3b8', padding: 0,
                  display: 'flex', alignItems: 'center'
                }}
                aria-label={showPassword ? 'Slėpti slaptažodį' : 'Rodyti slaptažodį'}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1, height: '4px', borderRadius: '2px',
                        background: i <= strength ? strengthInfo[strength].color : '#e2e8f0',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: strengthInfo[strength].color, fontWeight: 600 }}>
                  {strengthInfo[strength].label}
                </span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm">Pakartokite slaptažodį</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Pakartokite naują slaptažodį"
              required
              style={{
                borderColor: confirm && confirm !== password ? '#fca5a5' : undefined,
              }}
            />
            {confirm && confirm !== password && (
              <span className={styles.formHint} style={{ color: '#ef4444' }}>
                Slaptažodžiai nesutampa
              </span>
            )}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading || !token}
            style={{ opacity: loading || !token ? 0.7 : 1 }}
          >
            {loading ? 'Keičiama...' : 'Pakeisti slaptažodį'}
          </button>
        </form>

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Kraunama...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
