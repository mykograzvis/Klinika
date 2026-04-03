"use client";
import API_URL from '@/services/api';
import { useState } from "react";

export default function AiTestPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (text: string) => setLog(prev => [...prev, text]);

  const test = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponse("");
    addLog(`→ Siunčiama: "${message}"`);

    try {
      addLog("→ fetch pradėtas...");

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: [] }),
      });

      addLog(`→ HTTP statusas: ${res.status}`);

      const text = await res.text();
      addLog(`→ Raw atsakymas: ${text.slice(0, 200)}`);

      if (res.ok) {
        const data = JSON.parse(text);
        setResponse(data.response ?? JSON.stringify(data));
        addLog("✅ Sėkmė!");
      } else {
        setResponse(`Klaida ${res.status}: ${text}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`❌ Klaida: ${msg}`);
      setResponse(`Klaida: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const pingTest = async () => {
    setLoading(true);
    addLog("→ Ping testas...");
    try {
      const res = await fetch(`${API_URL}/api/chat/ping`);
      addLog(`→ Ping statusas: ${res.status}`);
      const text = await res.text();
      addLog(`→ Ping atsakymas: ${text}`);
    } catch (err: unknown) {
      addLog(`❌ Ping klaida: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", fontFamily: "monospace" }}>
      <h2>AI Testas</h2>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={pingTest}
          disabled={loading}
          style={{ padding: "8px 16px", marginRight: 8, cursor: "pointer" }}
        >
          1. Ping testas (GET)
        </button>
        <small style={{ color: "#666" }}>Patikrina ar serveris atsako</small>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && test()}
          placeholder="Pvz: Surask pacientą Jonas"
          style={{ width: "60%", padding: "8px", marginRight: 8 }}
        />
        <button
          onClick={test}
          disabled={loading || !message.trim()}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          2. Siųsti AI (POST)
        </button>
      </div>

      {response && (
        <div style={{
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          whiteSpace: "pre-wrap"
        }}>
          <strong>Atsakymas:</strong><br />
          {response}
        </div>
      )}

      <div style={{
        background: "#1e1e1e",
        color: "#d4d4d4",
        borderRadius: 8,
        padding: 16,
        minHeight: 120,
        fontSize: 13,
        whiteSpace: "pre-wrap"
      }}>
        <strong style={{ color: "#9cdcfe" }}>Log:</strong>
        {log.length === 0
          ? <div style={{ color: "#666", marginTop: 8 }}>Laukiama...</div>
          : log.map((l, i) => <div key={i} style={{ marginTop: 4 }}>{l}</div>)
        }
      </div>

      <button
        onClick={() => setLog([])}
        style={{ marginTop: 8, padding: "4px 12px", cursor: "pointer", fontSize: 12 }}
      >
        Išvalyti log
      </button>
    </div>
  );
}
