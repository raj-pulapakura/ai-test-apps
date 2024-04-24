import React from "react";
import ImageCard from "./ImageCard";

export default function ImageGrid({ imageUrls }: { imageUrls: string[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 mt-3">
      {imageUrls.map((imageUrl) => (
        <div className="m-0 mb-4">
          <ImageCard key={imageUrl} imageUrl={imageUrl} />
        </div>
      ))}
    </div>
  );
}
