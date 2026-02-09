"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [tempUserId, setTempUserId] = useState(null);
  const router = useRouter();

  const GOOGLE_CLIENT_ID = "24323776007-3b7m3gjv13qm2keg8atgm9hvi5fg4s8a.apps.googleusercontent.com";

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

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');

    try {
      const response = await fetch('https://localhost:7237/api/Auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Nepavyko prisijungti su Google.");
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

      if (data.isNewUser) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userName', data.vardas);
        localStorage.setItem('userId', data.userId);
        router.push('/profilis?complete=true');
      } else {
        loginSuccess(data);
      }
    } catch (err) {
      setError("Nepavyko susisiekti su serveriu.");
    }
  };

  const handleGoogleError = () => {
    setError("Google prisijungimas nepavyko. Bandykite dar kartą.");
  };

  const loginSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userName', data.vardas);
    localStorage.setItem('userId', data.userId);
    router.push('/rezervacija');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Kraunama...</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          {step === 1 ? (
            <>
              <h1 className={styles.authTitle}>Sveiki sugrįžę!</h1>
              <p className={styles.authSubtitle}>Prisijunkite prie savo paskyros</p>

              {/* Step indikatorius */}
              <div className={styles.stepIndicator}>
                <div className={`${styles.stepDot} ${styles.active}`}></div>
                <div className={styles.stepDot}></div>
              </div>

              <form onSubmit={handleLogin} className={styles.authForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">El. paštas</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onInvalid={(e) => handleInvalid(e, "Įveskite el. paštą")}
                    onInput={handleInput}
                    placeholder="vardas@example.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Slaptažodis</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onInvalid={(e) => handleInvalid(e, "Įveskite slaptažodį")}
                    onInput={handleInput}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <button type="submit" className={styles.btnPrimary}>
                  Prisijungti
                </button>
              </form>

              <div className={styles.divider}>
                <span>ARBA</span>
              </div>

              <div className={styles.googleLoginWrapper}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              <div className={styles.authFooter}>
                <p>
                  Neturite paskyros?{' '}
                  <Link href="/registracija" className={styles.authLink}>
                    Registruotis
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setStep(1);
                  setTwoFactorCode('');
                  setError('');
                }}
                className={styles.backButton}
              >
                Grįžti
              </button>

              <h1 className={styles.tfaTitle}>Dviejų faktorių autentifikacija</h1>
              <p className={styles.tfaDescription}>
                Atidarykite autentifikatoriaus programėlę ir įveskite 6 skaitmenų kodą
              </p>

              {/* Step indikatorius */}
              <div className={styles.stepIndicator}>
                <div className={styles.stepDot}></div>
                <div className={`${styles.stepDot} ${styles.active}`}></div>
              </div>

              <form onSubmit={handle2FAVerify} className={styles.authForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="twoFactorCode">Autentifikavimo kodas</label>
                  <input
                    type="text"
                    id="twoFactorCode"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    onInvalid={(e) => handleInvalid(e, "Įveskite 6 skaitmenų kodą")}
                    onInput={handleInput}
                    placeholder="000000"
                    maxLength={6}
                    pattern="\d{6}"
                    required
                    autoFocus
                  />
                  <small className={styles.formHint}>
                    Kodas atsinaujina kas 30 sekundžių
                  </small>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <button type="submit" className={styles.btnPrimary}>
                  Patvirtinti
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
