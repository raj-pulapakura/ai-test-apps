import React from "react";

export default function ImageCard({ imageUrl }: { imageUrl: string }) {
  return <img src={imageUrl} />;
}
