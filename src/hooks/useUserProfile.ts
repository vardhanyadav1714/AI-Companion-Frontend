"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api-client";

type UserProfile = {
  displayName?: string;
  occupation?: string;
  preferredName?: string;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiRequest<UserProfile>("/profile")
      .then((response) => {
        if (mounted && response.success) {
          setProfile(response.data);
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
    profile,
    isLoading
  };
}
