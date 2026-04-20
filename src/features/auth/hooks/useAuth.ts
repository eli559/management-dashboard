"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import type { User } from "@/types";
import { ROUTES } from "@/lib/constants";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login({ email, password });
        setUser(response.user);
        router.push(ROUTES.DASHBOARD);
      } catch {
        setError("שם משתמש או סיסמה שגויים");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
    } finally {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  return { user, isLoading, error, login, logout };
}
