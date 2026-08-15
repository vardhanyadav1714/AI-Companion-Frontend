import { Suspense } from "react";

import { ChatExperience } from "@/components/chat/ChatExperience";

export default function ChatPage() {
  return (
    <Suspense fallback={<main className="chat-loading">Opening conversation...</main>}>
      <ChatExperience />
    </Suspense>
  );
}
