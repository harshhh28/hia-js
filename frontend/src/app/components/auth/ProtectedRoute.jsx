import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    router.push("/auth");
    return null;
  }

  return children;
}
