"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";
import Link from "next/link";
import Image from "next/image";

type SubStatus = "basic" | "premium" | "premium-plus";

function SettingsSkeleton() {
  return (
    <div className="app-page">
      <div className="skeleton" style={{ height: "32px", width: "180px", marginBottom: "32px", borderRadius: "6px" }} />
      {[1, 2].map((i) => (
        <div key={i} style={{ border: "1px solid #e1e7ea", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
          <div className="skeleton" style={{ height: "18px", width: "120px", marginBottom: "16px", borderRadius: "4px" }} />
          <div className="skeleton" style={{ height: "24px", width: "200px", marginBottom: "12px", borderRadius: "4px" }} />
          <div className="skeleton" style={{ height: "40px", width: "140px", borderRadius: "4px" }} />
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subStatus, setSubStatus] = useState<SubStatus>("basic");
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            const data = snap.data();
            setSubStatus(data.subscription ?? "basic");
          }
        } catch {
          // default to basic
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <SettingsSkeleton />;

  if (!user) {
    return (
      <div className="app-page">
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#032b41", paddingBottom: "24px", borderBottom: "1px solid #e1e7ea", marginBottom: "40px" }}>
          Settings
        </h1>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "24px" }}>
          <div style={{ width: "500px", marginBottom: "16px" }}>
            <Image
              src="/login.png"
              alt="Login to view settings"
              width={500}
              height={500}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
            Log in to your account to see your details.
          </p>
          <button
            style={{
              width: "200px",
              height: "40px",
              backgroundColor: "#2bd97c",
              color: "#032b41",
              fontSize: "16px",
              fontWeight: 400,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 200ms",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#20ba68")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2bd97c")}
            onClick={() => dispatch(openModal("login"))}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const planLabel =
    subStatus === "premium-plus"
      ? "Premium Plus ✦"
      : subStatus === "premium"
      ? "Premium"
      : "Basic";

  return (
    <div className="app-page">
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#032b41", paddingBottom: "24px", borderBottom: "1px solid #e1e7ea", marginBottom: "24px" }}>
        Settings
      </h1>

      {success && (
        <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "12px 20px", borderRadius: "6px", marginBottom: "24px", fontSize: "15px" }}>
          🎉 Your subscription is now active!
        </div>
      )}

      <div style={{ border: "1px solid #e1e7ea", borderRadius: "8px", padding: "24px 32px", marginBottom: "24px", backgroundColor: "#fff" }}>
        <p style={{ fontSize: "13px", color: "#394547", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>
          Your plan
        </p>
        <p style={{ fontSize: "22px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
          {planLabel}
        </p>
        {subStatus === "basic" ? (
          <Link href="/choose-plan" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
            Upgrade to Premium
          </Link>
        ) : (
          <span style={{ display: "inline-block", backgroundColor: "#f1f6f4", color: "#032b41", padding: "6px 16px", borderRadius: "4px", fontSize: "14px", fontWeight: 500 }}>
            Active subscription
          </span>
        )}
      </div>

      <div style={{ border: "1px solid #e1e7ea", borderRadius: "8px", padding: "24px 32px", backgroundColor: "#fff" }}>
        <p style={{ fontSize: "13px", color: "#394547", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>
          Email address
        </p>
        <p style={{ fontSize: "17px", color: "#032b41", fontWeight: 500 }}>
          {user.email}
        </p>
      </div>
    </div>
  );
}