"use client";
import { useRouter } from "next/navigation";

export default function WelcomeClient({ videoUrl, username }: { videoUrl: string; username: string }) {
  const router = useRouter();

  return (
    <div style={{ position: "relative", height: "100vh", background: "#0a0a12", overflow: "hidden" }}>
      <video
        src={videoUrl}
        autoPlay
        muted
        playsInline
        onEnded={() => router.push("/dashboard")}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 40,
          background: "linear-gradient(180deg, transparent 40%, #0a0a12 95%)",
        }}
      >
        <p className="mono" style={{ color: "#8888a0", marginBottom: 16, letterSpacing: "0.08em" }}>
          SELAMAT DATANG, {username.toUpperCase()}
        </p>
        <button className="btn" onClick={() => router.push("/dashboard")}>
          Lewati &rarr;
        </button>
      </div>
    </div>
  );
}
