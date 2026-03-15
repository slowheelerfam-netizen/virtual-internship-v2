"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal, setView } from "@/store/modalSlice";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const { isOpen, view } = useAppSelector((state) => state.modal);
  const router = useRouter();

  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (view === "register") {
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      dispatch(closeModal());
      if (pathname === "/") router.push("/for-you");
    } catch (err: any) {
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
      dispatch(closeModal());
      if (pathname === "/") router.push("/for-you");
    } catch (err) {
      setError("Guest login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("");
    } catch {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="modal__overlay" onClick={() => dispatch(closeModal())}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={() => dispatch(closeModal())}>✕</button>

        <h2 className="modal__title">
          {view === "register" ? "Create your account" : "Log in to Summarist"}
        </h2>

        {error && <div className="modal__error">{error}</div>}
        {resetSent && (
          <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "8px 12px", borderRadius: "4px", fontSize: "14px", textAlign: "center" }}>
            Password reset email sent!
          </div>
        )}

        {/* Guest Login */}
        <button
          onClick={handleGuestLogin}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", height: "40px", backgroundColor: "#3a579d", color: "#fff", borderRadius: "4px", fontSize: "15px", fontWeight: 500, border: "none", cursor: "pointer", transition: "background-color 200ms" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2d4580")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3a579d")}
        >
          <FaUser size={16} />
          Login as a Guest
        </button>

        {/* Or divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e1e7ea" }} />
          <span style={{ fontSize: "14px", color: "#394547" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e1e7ea" }} />
        </div>

        {/* Google Login */}
        <button
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", height: "40px", backgroundColor: "#4285f4", color: "#fff", borderRadius: "4px", fontSize: "15px", fontWeight: 500, border: "none", cursor: "pointer", transition: "background-color 200ms" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#357ae8")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4285f4")}
        >
          <FcGoogle size={20} />
          Login with Google
        </button>

        {/* Or divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e1e7ea" }} />
          <span style={{ fontSize: "14px", color: "#394547" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e1e7ea" }} />
        </div>

        {/* Email / Password */}
        <input
          className="modal__input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="modal__input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login / Sign Up button — green */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "40px", backgroundColor: "#2bd97c", color: "#032b41", borderRadius: "4px", fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer", transition: "background-color 200ms" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#20ba68")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2bd97c")}
        >
          {loading ? "Please wait..." : view === "register" ? "Sign Up" : "Login"}
        </button>

        {/* Forgot password */}
        {view === "login" && (
          <div style={{ textAlign: "center" }}>
            <span
              onClick={handleForgotPassword}
              style={{ fontSize: "14px", color: "#2567ef", cursor: "pointer" }}
            >
              Forgot your password?
            </span>
          </div>
        )}

        {/* Switch view */}
        <div style={{ textAlign: "center", fontSize: "14px", color: "#394547" }}>
          {view === "register" ? (
            <>Already have an account?{" "}
              <span onClick={() => dispatch(setView("login"))} style={{ color: "#2567ef", cursor: "pointer", fontWeight: 500 }}>Login</span>
            </>
          ) : (
            <span onClick={() => dispatch(setView("register"))} style={{ color: "#2567ef", cursor: "pointer", fontWeight: 500 }}>
              Don&apos;t have an account?
            </span>
          )}
        </div>
      </div>
    </div>
  );
}