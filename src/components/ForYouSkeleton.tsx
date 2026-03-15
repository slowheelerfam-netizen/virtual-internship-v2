export default function ForYouSkeleton() {
  return (
    <div style={{ maxWidth: "100%", width: "100%", padding: "40px 48px" }}>

      {/* Selected book skeleton */}
      <section style={{ marginBottom: "40px" }}>
        <div className="skeleton" style={{ height: "28px", width: "240px", borderRadius: "6px", marginBottom: "16px" }} />
        <div
          style={{
            display: "flex",
            gap: "24px",
            backgroundColor: "#FBEFD6",
            borderRadius: "8px",
            padding: "24px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: "16px", width: "90%", borderRadius: "4px", marginBottom: "8px" }} />
            <div className="skeleton" style={{ height: "16px", width: "70%", borderRadius: "4px" }} />
          </div>
          <div style={{ width: "1px", backgroundColor: "#bac8ce", alignSelf: "stretch" }} />
          <div style={{ display: "flex", gap: "16px", flex: 1 }}>
            <div className="skeleton" style={{ width: "140px", height: "140px", flexShrink: 0, borderRadius: "4px" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="skeleton" style={{ height: "18px", width: "80%", borderRadius: "4px" }} />
              <div className="skeleton" style={{ height: "14px", width: "60%", borderRadius: "4px" }} />
              <div className="skeleton" style={{ height: "14px", width: "100px", borderRadius: "4px" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended skeleton */}
      <BookRowSkeleton label="Recommended For You" />

      {/* Suggested skeleton */}
      <BookRowSkeleton label="Suggested Books" />
    </div>
  );
}

function BookRowSkeleton({ label }: { label: string }) {
  return (
    <section style={{ marginBottom: "40px" }}>
      <div className="skeleton" style={{ height: "26px", width: `${label.length * 11}px`, borderRadius: "6px", marginBottom: "8px" }} />
      <div className="skeleton" style={{ height: "14px", width: "160px", borderRadius: "4px", marginBottom: "16px" }} />
      <div style={{ display: "flex", gap: "16px" }}>
        {[...Array(5)].map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function BookCardSkeleton() {
  return (
    <div style={{ width: "160px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
      <div className="skeleton" style={{ width: "160px", height: "200px", borderRadius: "6px" }} />
      <div className="skeleton" style={{ height: "14px", width: "80%", borderRadius: "4px" }} />
      <div className="skeleton" style={{ height: "12px", width: "60%", borderRadius: "4px" }} />
      <div className="skeleton" style={{ height: "12px", width: "50%", borderRadius: "4px" }} />
    </div>
  );
}
