"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { handleLogout } from "../utils/auth";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                HIA - Health Insights Agent
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Hi, {session.user.name}! 👋
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Welcome to the Health Insights Agent. You're successfully
                authenticated!
              </p>
              <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Your Account Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{session.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{session.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">User ID:</span>
                    <span className="font-medium">{session.user.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
