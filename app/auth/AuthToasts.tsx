"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthToasts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const t = searchParams.get("toast");
    if (!t) {
      handled.current = null;
      return;
    }
    if (handled.current === t) return;
    handled.current = t;
    if (t === "logged-in" || t === "logged-out") {
      toast.success(
        t === "logged-in" ? "Logged in successfully." : "Logged out successfully."
      );
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const qs = params.toString();
    router.replace(`${pathname ?? ""}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}
