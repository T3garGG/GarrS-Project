"use client";
import { useEffect, useRef, useState } from "react";

type BotEvent = {
  id: string;
  eventType: string;
  payload: string;
  createdAt: string;
};

type ChatMsg = {
  id: string;
  from: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
};

export default function WhatsAppBotClient() {
  const [events, setEvents] = useState<BotEvent[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msgText, setMsgText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadEvents() {
    const res = await fetch("/api/bots/events?type=whatsapp");
    if (res.ok) {
      const data: BotEvent[] = await res.json();
      setEvents(data);
      processEvents(data);
    }
  }

  function processEvents(data: BotEvent[]) {
    let latestQr: string | null = null;
    let latestInfo: any = null;
    let latestConnected = false;
    let chats: ChatMsg[] = [];

    for (const evt of data) {
      try {
        const payload = JSON.parse(evt.payload);

        if (evt.eventType === "qr_code" && payload.qr) {
          latestQr = payload.qr;
        }
        if (evt.eventType === "bot_info") {
          latestInfo = payload;
        }
        if (evt.eventType === "status") {
          latestConnected = payload.connected || false;
        }
        if (evt.eventType === "incoming_message") {
          chats.push({
            id: evt.id,
            from: payload.from || "unknown",
            content: payload.content || "",
            isOwn: false,
            timestamp: payload.timestamp || evt.createdAt,
          });
        }
        if (evt.eventType === "outgoing_message") {
          chats.push({
            id: evt.id,
            from: payload.to || "Anda",
            content: payload.content || "",
            isOwn: true,
            timestamp: evt.createdAt,
          });
        }
      } catch {}
    }

    setQrCode(latestQr);
    setBotInfo(latestInfo);
    setConnected(latestConnected);
    // dedupe messages by id, keep latest first
    const unique = chats.filter(
      (m, i, arr) => arr.findIndex((x) => x.id === m.id) === i
    );
    setMessages(unique.reverse());
  }

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!msgText.trim() || loading) return;
    setLoading(true);
    const res = await fetch("/api/bots/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "whatsapp", content: msgText }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsgText("");
      loadEvents();
    } else {
      alert(data.error || "Gagal kirim pesan.");
    }
  }

  function renderQrCode(qr: string) {
    // Simple QR from raw string — in production, use a proper QR lib
    // For now, show the raw QR data string which Baileys provides
    return (
      <div className="panel" style={{ padding: 16, marginBottom: 16 }}>
        <p className="label-dim mono" style={{ marginBottom: 8 }}>Scan QR Code dengan WhatsApp</p>
        <div
          style={{
            width: 200, height: 200, margin: "0 auto",
            background: "#000", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontSize: 10, textAlign: "center",
            wordBreak: "break-all", padding: 8, borderRadius: 8,
          }}
        >
          {qr}
        </div>
        <p className="label-dim" style={{ textAlign: "center", marginTop: 8, fontSize: 11 }}>
          Buka WhatsApp &rarr; Settings &rarr; Whatsapp Web/Desktop &rarr; Scan QR
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="label-dim mono">WHATSAPP BOT</p>
        <span className="badge" style={{ color: connected ? "var(--success)" : "var(--text-dim)" }}>
          {connected ? "terhubung" : "terputus"}
        </span>
      </div>

      {botInfo && (
        <p className="label-dim" style={{ fontSize: 13 }}>
          Nomor: {botInfo.phone || botInfo.number || "-"} | Nama: {botInfo.name || "-"}
        </p>
      )}

      {qrCode && renderQrCode(qrCode)}

      {!qrCode && !connected && (
        <p className="label-dim" style={{ fontSize: 13, padding: 12 }}>
          Bot belum tersambung. Pastikan proses bot di VPS berjalan dan terhubung ke webhook ini.
        </p>
      )}

      <section className="panel" style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
        <p className="label-dim mono" style={{ marginBottom: 8, fontSize: 12 }}>CHAT</p>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 300, padding: 8 }}>
          {messages.map((m) => (
            <div key={m.id} style={{
              marginBottom: 10,
              textAlign: m.isOwn ? "right" : "left",
            }}>
              <span className="mono" style={{ fontSize: 11, color: m.isOwn ? "var(--accent)" : "var(--accent-2)" }}>
                {m.isOwn ? "Anda" : m.from}
              </span>
              <div className="panel" style={{
                display: "inline-block", marginTop: 4, padding: "6px 12px", borderRadius: 12,
                background: m.isOwn ? "var(--accent)" : "var(--bg)",
                color: m.isOwn ? "#fff" : "var(--text)",
              }}>
                <p style={{ margin: 0, fontSize: 13 }}>{m.content}</p>
                <span className="label-dim" style={{ fontSize: 10 }}>
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            placeholder="Ketik pesan..."
            style={{ flex: 1 }}
            disabled={loading || !connected}
          />
          <button className="btn" disabled={loading || !connected || !msgText.trim()}>
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </section>
    </div>
  );
}
