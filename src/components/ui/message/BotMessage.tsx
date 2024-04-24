import React from "react";

export default function BotMessage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-md font-bold mb-2">Bot</p>
      <p className="text-xl">{children}</p>
    </div>
  );
}
