import React from "react";

export default function UserMessage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-md font-bold mb-2">User</p>
      <p className="text-xl">{children}</p>
    </div>
  );
}
