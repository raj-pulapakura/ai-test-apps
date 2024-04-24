import { AI } from "@/actions/chat";
import { useActions, useUIState } from "ai/rsc";
import React, { useRef, useState } from "react";
import UserMessage from "../ui/message/UserMessage";
import ClipLoader from "react-spinners/ClipLoader";

export default function ChatInput({ tip }: { tip?: string }) {
  const [inputValue, setInputValue] = useState("");
  const { submitUserMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-10 fixed top-0 w-full bg-black">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <UserMessage>{inputValue}</UserMessage>,
            },
          ]);

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue);

          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);

          setInputValue("");
          setLoading(false);
        }}
        className="p-0 m-0"
      >
        {loading && (
          <ClipLoader
            color={"white"}
            loading={loading}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
        <input
          className="text-white bg-black w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Send a message..."
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        {tip && <p className="text-sm mt-3 text-gray-600">{tip}</p>}
      </form>
    </div>
  );
}
