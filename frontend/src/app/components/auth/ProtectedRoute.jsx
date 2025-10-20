import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "../Loading";

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Loading />;
  }

  // Check if session exists but tokens are null (refresh failed)
  if (!session || !session.accessToken) {
    router.push("/auth");
    return null;
  }

  return children;
}
