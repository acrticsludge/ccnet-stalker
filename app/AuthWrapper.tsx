"use client";
import { useUser } from "@/app/context/AuthProvider"; // Use the same context
import { useRouter } from "next/navigation";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const router = useRouter();

  if (!user) {
    // You might want to return null or a loader here while AuthProvider is checking
    return <div className="p-10 text-center">Checking access...</div>;
  }

  return <>{children}</>;
}
