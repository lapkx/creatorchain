// hooks/useProtectedRoute.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function useProtectedRoute(requiredRole = null) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Wait for auth to initialize
    if (user === null) {
      router.replace("/auth");
    } else if (requiredRole && user?.role !== requiredRole) {
      // Redirect if role doesn't match
      router.replace("/auth");
    }
  }, [user, router, requiredRole]);
}
