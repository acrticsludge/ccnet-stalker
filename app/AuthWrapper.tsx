"use client";

import { useUser } from "@/app/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="p-10 text-center">Checking access…</div>;
  }

  if (!user) {
    return null; // redirecting
  }

  return <>{children}</>;
}
