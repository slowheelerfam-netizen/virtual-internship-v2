"use client";

import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";

export default function LoginButton({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  return (
    <button className={className} onClick={() => dispatch(openModal("login"))}>
      Login
    </button>
  );
}
