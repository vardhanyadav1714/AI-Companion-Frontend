"use client";

import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "@/lib/api-client";

export type ConversationPreview = {
  id: string;
  title: string;
  companionId: string;
  lastMessageAt: string;
};

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const response = await apiRequest<ConversationPreview[]>("/conversations");

    if (response.success) {
      setConversations(response.data);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    conversations,
    isLoading,
    refresh
  };
}
