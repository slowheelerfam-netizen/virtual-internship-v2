"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal, setView } from "@/store/modalSlice";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const { isOpen, view } = useAppSelector((state) => state.modal);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.push("/for-you");
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
      router.push("/for-you");
    } catch (err) {
      setError("Guest login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="modal__overlay" onClick={() => dispatch(closeModal())}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={() => dispatch(closeModal())}>✕</button>

        <h2 className="modal__title">
          {view === "register" ? "Create your account" : "Log in to Summarist"}
        </h2>

        {error && <div className="modal__error">{error}</div>}

        <input
          className="modal__input"
          type="email"
          placeholder="Email"
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

        <button className="btn modal__btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : view === "register" ? "Sign Up" : "Login"}
        </button>

        <button className="btn modal__btn modal__btn--guest" onClick={handleGuestLogin} disabled={loading}>
          Login as Guest
        </button>

        <div className="modal__switch">
          {view === "register" ? (
            <>Already have an account?{" "}
              <span onClick={() => dispatch(setView("login"))}>Login</span>
            </>
          ) : (
            <>Don&apos;t have an account?{" "}
              <span onClick={() => dispatch(setView("register"))}>Sign Up</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}