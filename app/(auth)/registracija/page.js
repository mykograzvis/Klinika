"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';
import API_URL from '@/services/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    vardas: '',
    pavarde: '',
    asmensKodas: '',
    elPastas: '',
    slaptazodis: '',
    telefonas: '',
    amzius: '',
    kraujoGrupe: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Išvalyti klaidą kai vartotojas keičia duomenis
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Paversti amžių į skaičių
      const submitData = {
        ...formData,
        amzius: parseInt(formData.amzius) || 0,
        tipas: "Pacientas" // Pagal nutylėjimą pacientas
      };

      const res = await fetch(`${API_URL}/api/Auth/registracija`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (res.ok) {
        setSuccess("Registracija sėkminga! Nukreipiame į prisijungimą...");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const errorData = await res.json().catch(() => null);
        setError(errorData?.message || errorData || "Klaida registruojantis. Patikrinkite duomenis.");
      }
    } catch (err) {
      setError("Nepavyko susisiekti su serveriu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Slaptažodžio stiprumo tikrinimas
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.slaptazodis);
  const strengthLabels = ['', 'Silpnas', 'Vidutinis', 'Geras', 'Stiprus'];
  const strengthClasses = ['', 'weak', 'medium', 'strong', 'strong'];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Kraunama...</p>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Sukurti paskyrą</h1>
        <p className={styles.authSubtitle}>Užpildykite formą ir pradėkite naudotis</p>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {/* Vardas ir Pavardė */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="vardas">Vardas *</label>
              <input
                type="text"
                id="vardas"
                name="vardas"
                value={formData.vardas}
                onChange={handleChange}
                onInvalid={(e) => handleInvalid(e, "Įveskite vardą")}
                onInput={handleInput}
                placeholder="Jonas"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pavarde">Pavardė *</label>
              <input
                type="text"
                id="pavarde"
                name="pavarde"
                value={formData.pavarde}
                onChange={handleChange}
                onInvalid={(e) => handleInvalid(e, "Įveskite pavardę")}
                onInput={handleInput}
                placeholder="Jonaitis"
                required
              />
            </div>
          </div>

          {/* El. paštas */}
          <div className={styles.formGroup}>
            <label htmlFor="elPastas">El. paštas *</label>
            <input
              type="email"
              id="elPastas"
              name="elPastas"
              value={formData.elPastas}
              onChange={handleChange}
              onInvalid={(e) => handleInvalid(e, "Įveskite galiojantį el. paštą")}
              onInput={handleInput}
              placeholder="jonas@example.com"
              required
            />
          </div>

          {/* Slaptažodis */}
          <div className={styles.formGroup}>
            <label htmlFor="slaptazodis">Slaptažodis *</label>
            <input
              type="password"
              id="slaptazodis"
              name="slaptazodis"
              value={formData.slaptazodis}
              onChange={handleChange}
              onInvalid={(e) => handleInvalid(e, "Įveskite slaptažodį (min. 6 simboliai)")}
              onInput={handleInput}
              placeholder="••••••••"
              minLength={6}
              required
            />
            {formData.slaptazodis && (
              <>
                <div className={styles.passwordStrength}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`${styles.strengthBar} ${
                        level <= passwordStrength
                          ? `${styles.active} ${styles[strengthClasses[passwordStrength]]}`
                          : ''
                      }`}
                    />
                  ))}
                </div>
                <span className={styles.strengthText}>
                  {strengthLabels[passwordStrength]} slaptažodis
                </span>
              </>
            )}
          </div>

          {/* Asmens kodas ir Telefonas */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="asmensKodas">Asmens kodas *</label>
              <input
                type="text"
                id="asmensKodas"
                name="asmensKodas"
                value={formData.asmensKodas}
                onChange={handleChange}
                onInvalid={(e) => handleInvalid(e, "Įveskite asmens kodą")}
                onInput={handleInput}
                placeholder="12345678901"
                pattern="\d{11}"
                maxLength={11}
                required
              />
              <small className={styles.formHint}>11 skaitmenų</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefonas">Telefonas *</label>
              <input
                type="tel"
                id="telefonas"
                name="telefonas"
                value={formData.telefonas}
                onChange={handleChange}
                onInvalid={(e) => handleInvalid(e, "Įveskite telefono numerį")}
                onInput={handleInput}
                placeholder="+370 600 00000"
                required
              />
            </div>
          </div>

          {/* Amžius ir Kraujo grupė */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="amzius">Amžius *</label>
              <input
                type="number"
                id="amzius"
                name="amzius"
                value={formData.amzius}
                onChange={handleChange}
                onInvalid={(e) => handleInvalid(e, "Įveskite amžių")}
                onInput={handleInput}
                placeholder="25"
                min="0"
                max="120"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="kraujoGrupe">Kraujo grupė *</label>
              <input
                type="text"
                id="kraujoGrupe"
                name="kraujoGrupe"
                value={formData.kraujoGrupe}
                onChange={handleChange}
                placeholder="A+, B-, O+ ir kt."
              />
            </div>
          </div>

          {/* Klaidos/Sėkmės pranešimai */}
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          {/* Submit mygtukas */}
          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registruojama...' : 'Registruotis'}
          </button>
        </form>

        {/* Footer su nuoroda į Login */}
        <div className={styles.authFooter}>
          <p>
            Jau turite paskyrą?{' '}
            <Link href="/login" className={styles.authLink}>
              Prisijungti
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
