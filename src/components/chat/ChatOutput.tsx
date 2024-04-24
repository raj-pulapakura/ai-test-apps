import { AI } from "@/actions/chat";
import { useUIState } from "ai/rsc";
import React, { useEffect, useRef } from "react";

export default function ChatOutput() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const containerRef = useRef<HTMLDivElement>(null);

  // scroll to bottom of chat container when new messages are added
  useEffect(() => {
    // if (containerRef.current) {
    //   containerRef.current.scrollTop = containerRef.current?.scrollHeight;
    // }
    console.log("hello");
  }, [messages[-1]?.display?.toString()]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div ref={containerRef} className="p-10 mt-32">
      {
        // View messages in UI state
        messages.map((message) => (
          <div key={message.id} className="mb-10">
            {message.display}
          </div>
        ))
      }
    </div>
  );
}
