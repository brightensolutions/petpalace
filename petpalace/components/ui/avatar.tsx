import * as React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className = "" }: AvatarProps) {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt || "Avatar"}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
