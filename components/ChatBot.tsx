"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatBot.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_BASE = "https://localhost:7237";

// Paima viską IKI </think> kaip "think" dalį — nepaisant ar pradžioje yra <think> ar ne.
// Pvz.: "Galvoju...\nResultas</think>Atsakymas" → think="Galvoju...\nResultas", content="Atsakymas"
function parseThink(text: string): { think: string; content: string } {
  const closeTag = text.indexOf("</think>");
  if (closeTag === -1) return { think: "", content: text.trim() };

  // Viskas iki </think> — pašaliname galimą <think> atidaromąjį žymą jei yra
  let think = text.slice(0, closeTag).replace(/^<think>/i, "").trim();
  const content = text.slice(closeTag + "</think>".length).trim();
  return { think, content };
}

export default function ChatBot() {
  const [messages, setMessages]         = useState<Message[]>([
    { role: "assistant", content: "Sveiki! Esu klinikos asistentas. Kuo galiu padėti?" },
  ]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_BASE}/api/chat/quick-actions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.actions) setQuickActions(data.actions); })
      .catch(() => setQuickActions([
        "Laisvi laikai burnos higienai",
        "Mano artėjantys vizitai",
        "Vizitų istorija",
      ]));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    const updatedMessages  = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const token   = localStorage.getItem("token");
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: msg, history }),
      });

      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);

      const data = await res.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.response ?? "Negavau atsakymo." },
      ]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Nežinoma klaida";
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: `Klaida: ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Sveiki! Esu klinikos asistentas. Kuo galiu padėti?" }]);
    setInput("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h1 className={styles.title}>Klinikos asistentas</h1>
              <span className={styles.status}>
                <span className={styles.statusDot} />
                Veikia
              </span>
            </div>
          </div>
          <button className={styles.clearBtn} onClick={clearChat} title="Naujas pokalbis">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            Naujas
          </button>
        </div>

        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.messageRow} ${msg.role === "user" ? styles.userRow : styles.assistantRow}`}>
              {msg.role === "assistant" && <div className={styles.msgAvatar}>AI</div>}
              <div className={`${styles.bubble} ${msg.role === "user" ? styles.userBubble : styles.assistantBubble}`}>
                <AssistantBubbleContent role={msg.role} content={msg.content} />
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.messageRow} ${styles.assistantRow}`}>
              <div className={styles.msgAvatar}>AI</div>
              <div className={`${styles.bubble} ${styles.assistantBubble} ${styles.loadingBubble}`}>
                <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && quickActions.length > 0 && (
          <div className={styles.quickActions}>
            {quickActions.map((q, i) => (
              <button key={i} className={styles.quickBtn} onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>
        )}

        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            className={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rašykite klausimą... (Enter – siųsti, Shift+Enter – nauja eilutė)"
            rows={1}
            disabled={loading}
          />
          <button className={styles.sendBtn} onClick={() => sendMessage()} disabled={!input.trim() || loading} title="Siųsti">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

function AssistantBubbleContent({ role, content }: { role: string; content: string }) {
  if (role !== "assistant") return <>{formatMessage(content)}</>;

  const { think, content: mainContent } = parseThink(content);

  return (
    <>
      {think && (
        <details className={styles.thinkBlock}>
          <summary className={styles.thinkSummary}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            Modelio mąstymas
          </summary>
          <pre className={styles.thinkContent}>{think}</pre>
        </details>
      )}
      {formatMessage(mainContent)}
    </>
  );
}

function formatMessage(text: string) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}
