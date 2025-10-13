"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import ChatApp from "./components/ChatApp";
import Loading from "./components/Loading";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Enable automatic token refresh
  useTokenRefresh();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (status === "loading") return;
    if (!session) {
      router.push("/auth");
      return;
    }
  }, [session, status, router, isClient]);

  if (!isClient || status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return <Loading />;
  }

  return <ChatApp />;
}
