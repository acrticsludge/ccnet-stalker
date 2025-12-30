"use client";
import { useUser } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser(); // Destructure user and loading
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we are NOT loading and there is NO user
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // 2. Not Logged In (Wait for redirect in useEffect, or show message)
  if (!user) {
    return null; // Render nothing while redirecting
  }

  // 3. Logged In -> Show Protected Content
  return <>{children}</>;
}
