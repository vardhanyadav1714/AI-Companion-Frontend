"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api-client";

type User = {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiRequest<User>("/auth/me")
      .then((response) => {
        if (mounted && response.success) {
          setUser(response.data);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading
  };
}
