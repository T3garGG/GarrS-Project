import BackButton from "@/components/BackButton";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 16, maxWidth: 1100, margin: "0 auto" }}>
        <BackButton />
      </div>
      {children}
    </>
  );
}
