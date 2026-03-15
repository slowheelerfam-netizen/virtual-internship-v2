"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";
import { auth } from "@/lib/firebase";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

// ── types ─────────────────────────────────────────────────────────────────────

type Plan = "yearly" | "monthly";

interface FaqItem {
  q: string;
  a: string;
}

// ── data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  "Access to 400+ summaries",
  "Audio & text formats",
  "New titles added weekly",
  "Key insights from top authors",
  "Offline listening",
  "Personalized recommendations",
];

const FAQS: FaqItem[] = [
  {
    q: "How does the free trial work?",
    a: "Begin your 7-day free trial with a yearly plan. You won't be charged until the trial ends. Cancel anytime from the Settings page before the trial concludes.",
  },
  {
    q: "Can I switch between plans?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.",
  },
  {
    q: "What happens after my trial ends?",
    a: "After your 7-day trial, your chosen plan renews automatically. You'll receive an email reminder before the charge.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime from the Settings page. Your access continues until the end of the current billing period.",
  },
];

// ── subcomponents ─────────────────────────────────────────────────────────────

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderTop: "1px solid #e1e7ea",
        padding: "20px 0",
        cursor: "pointer",
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "16px", fontWeight: 600, color: "#032b41" }}>{item.q}</span>
        <span style={{ color: "#032b41", fontSize: "20px", flexShrink: 0 }}>
          {open ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </span>
      </div>
      {open && (
        <p style={{ marginTop: "12px", fontSize: "15px", color: "#394547", lineHeight: 1.6 }}>
          {item.a}
        </p>
      )}
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function ChoosePlanPage() {
  const [plan, setPlan] = useState<Plan>("yearly");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = auth.currentUser;

const handleSubscribe = async () => {
  if (!user) {
    dispatch(openModal("login"));
    return;
  }

  const priceId =
    plan === "yearly"
      ? process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  }
};

  return (
    <div style={{ backgroundColor: "#032b41", minHeight: "100vh", color: "#fff" }}>
      {/* ── hero ── */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "64px 24px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px", lineHeight: 1.3 }}>
          Get unlimited access to many amazing books to read
        </h1>
        <p style={{ fontSize: "17px", color: "#bac8ce", marginBottom: "48px" }}>
          Turn your idle moments into learning opportunities with key insights from top non-fiction books.
        </p>

        {/* ── features list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px", textAlign: "left" }}>
          {FEATURES.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#2bd97c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#032b41",
                  fontSize: "13px",
                }}
              >
                <BsCheckLg />
              </span>
              <span style={{ fontSize: "16px" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* ── plan toggle ── */}
        <div
          style={{
            display: "flex",
            borderRadius: "8px",
            overflow: "hidden",
            border: "2px solid #2bd97c",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setPlan("yearly")}
            style={{
              flex: 1,
              padding: "20px 16px",
              backgroundColor: plan === "yearly" ? "#2bd97c" : "transparent",
              color: plan === "yearly" ? "#032b41" : "#fff",
              fontWeight: 600,
              fontSize: "15px",
              transition: "background-color 200ms, color 200ms",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 400, opacity: 0.8 }}>
              7-day free trial, then
            </span>
            <span style={{ fontSize: "20px", fontWeight: 700 }}>$99.99 / year</span>
            <span style={{ fontSize: "12px", opacity: 0.7 }}>~ $8.33 / month</span>
          </button>

          <button
            onClick={() => setPlan("monthly")}
            style={{
              flex: 1,
              padding: "20px 16px",
              backgroundColor: plan === "monthly" ? "#2bd97c" : "transparent",
              color: plan === "monthly" ? "#032b41" : "#fff",
              fontWeight: 600,
              fontSize: "15px",
              transition: "background-color 200ms, color 200ms",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 400, opacity: 0.8 }}>
              No trial
            </span>
            <span style={{ fontSize: "20px", fontWeight: 700 }}>$9.99 / month</span>
          </button>
        </div>

        {/* ── CTA ── */}
        <button
          onClick={handleSubscribe}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "4px",
            backgroundColor: "#2bd97c",
            color: "#032b41",
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "16px",
            transition: "opacity 200ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {plan === "yearly" ? "Start your free 7-day trial" : "Get started"}
        </button>

        <p style={{ fontSize: "13px", color: "#bac8ce", marginBottom: "64px" }}>
          {plan === "yearly"
            ? "Cancel your trial at any time before it ends and you won't be charged."
            : "30-day money back guarantee, no questions asked."}
        </p>

        {/* ── FAQ ── */}
        <div style={{ textAlign: "left", borderBottom: "1px solid #e1e7ea", marginBottom: "64px" }}>
          {FAQS.map((item) => (
            <AccordionItem key={item.q} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
