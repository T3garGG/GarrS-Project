"use client";
import { useEffect, useRef, useState } from "react";

type Msg = { id: string; content: string; createdAt: string; user: { username: string } };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/chat");
    if (res.ok) setMessages(await res.json());
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    if (res.ok) {
      setText("");
      load();
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 32, display: "flex", flexDirection: "column", height: "100vh" }}>
      <p className="label-dim mono">PUBLIC CHAT</p>
      <div className="panel" style={{ flex: 1, overflowY: "auto", padding: 16, margin: "12px 0" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 10 }}>
            <span className="mono" style={{ color: "var(--accent-2)", fontSize: 13 }}>{m.user.username}</span>
            <span className="label-dim" style={{ fontSize: 11, marginLeft: 8 }}>
              {new Date(m.createdAt).toLocaleTimeString()}
            </span>
            <p style={{ margin: "2px 0 0" }}>{m.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ketik pesan..." style={{ flex: 1 }} />
        <button className="btn">Kirim</button>
      </form>
    </div>
  );
}
