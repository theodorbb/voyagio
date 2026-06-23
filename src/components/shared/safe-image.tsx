"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

type SafeImageProps = ImageProps & {

  fallbackClassName?: string;
};

export function SafeImage({
  alt,
  className,
  fallbackClassName,
  fill,
  src,
  onError,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const missing =
    src == null || (typeof src === "string" && src.trim() === "");

  if (missing || failed) {
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" ? alt : "Image unavailable"}
        className={`flex items-center justify-center bg-gradient-to-br from-primary/25 via-[var(--background)] to-accent/20 ${
          fill ? "absolute inset-0" : ""
        } ${fallbackClassName ?? className ?? ""}`}
      >
        <ImageOff className="h-6 w-6 text-white/25" />
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
