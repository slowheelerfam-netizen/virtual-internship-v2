"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineBulb, AiOutlineSearch, AiOutlineSetting } from "react-icons/ai";
import { BsBookmark, BsQuestionCircle } from "react-icons/bs";
import { BiLogOut, BiMenu, BiX } from "react-icons/bi";
import { LuLogIn } from "react-icons/lu";

type NavItem = { label: string; icon: React.ReactNode; href: string | null };

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleAuth = async () => {
    if (user) {
      await signOut(auth);
    } else {
      dispatch(openModal("login"));
    }
    setIsOpen(false);
  };

  const topItems: NavItem[] = [
    { label: "For You", icon: <AiOutlineHome size={24} />, href: "/for-you" },
    { label: "My Library", icon: <BsBookmark size={22} />, href: "/library" },
    { label: "Highlights", icon: <AiOutlineBulb size={24} />, href: null },
  ];

  const bottomItems: NavItem[] = [
    { label: "Search", icon: <AiOutlineSearch size={24} />, href: null },
    { label: "Settings", icon: <AiOutlineSetting size={24} />, href: "/settings" },
    { label: "Help & Support", icon: <BsQuestionCircle size={22} />, href: null },
  ];

  const renderItem = (item: NavItem) => {
    const isActive = item.href && pathname === item.href;
    const isDisabled = !item.href;

    const content = (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "12px 20px",
        color: "#032b41",
        backgroundColor: isActive ? "#f1f6f4" : "transparent",
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "background-color 200ms",
        fontSize: "16px",
        fontWeight: 500,
        borderLeft: isActive ? "4px solid #2bd97c" : "4px solid transparent",
      }}>
        {item.icon}
        <span>{item.label}</span>
      </div>
    );

    if (isDisabled) return <div key={item.label}>{content}</div>;
    return (
      <Link key={item.label} href={item.href!} style={{ color: "#032b41", textDecoration: "none" }}>
        {content}
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="sidebar__hamburger"
        aria-label="Toggle menu"
        style={{ position: "fixed", top: "20px", left: "16px", zIndex: 60, background: "none", border: "none", cursor: "pointer", color: "#032b41", display: "none", alignItems: "center", justifyContent: "center" }}
      >
        {isOpen ? <BiX size={28} /> : <BiMenu size={28} />}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 45 }}
        />
      )}

      <aside
        className={`sidebar__aside${isOpen ? " sidebar__aside--open" : ""}`}
        style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "220px", backgroundColor: "#fff", borderRight: "1px solid #e1e7ea", display: "flex", flexDirection: "column", zIndex: 50, transition: "transform 300ms ease" }}
      >
        <div style={{ padding: "24px 20px", marginBottom: "8px" }}>
          <Image src="/logo.png" alt="Summarist" width={160} height={40} />
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>{topItems.map((item) => renderItem(item))}</div>
          <div>{bottomItems.map((item) => renderItem(item))}</div>
        </nav>

        <div style={{ padding: "16px 0", borderTop: "1px solid #e1e7ea" }}>
          <button
            onClick={handleAuth}
            style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 20px", width: "100%", color: "#032b41", fontSize: "16px", fontWeight: 500, cursor: "pointer", background: "none", border: "none" }}
          >
            {user ? <BiLogOut size={24} /> : <LuLogIn size={24} />}
            <span>{user ? "Logout" : "Login"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}