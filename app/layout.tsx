import "../styles/globals.css";

export const metadata = {
  title: "Dashboard",
  description: "Multi-tool dashboard: downloader, chat, bot control",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
