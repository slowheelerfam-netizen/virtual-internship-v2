'use client'

import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div className="app__content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ height: "80px", borderBottom: "1px solid #e1e7ea", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ maxWidth: "100%", width: "100%", margin: "0 auto", padding: "0 48px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <div style={{ width: "300px" }}>
              <SearchBar />
            </div>
          </div>
        </header>
        <main style={{ flex: 1, backgroundColor: "#fafafa" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
