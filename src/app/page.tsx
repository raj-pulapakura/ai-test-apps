"use client";

import ChatInput from "@/components/chat/ChatInput";
import ChatOutput from "@/components/chat/ChatOutput";

export default function Page() {
  return (
    <div>
      <ChatInput tip="Try typing 'Show me 10 cat images'" />
      <ChatOutput />
    </div>
  );
}
