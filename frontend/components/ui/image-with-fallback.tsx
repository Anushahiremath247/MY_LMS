"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc: string;
};

export const ImageWithFallback = ({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) => {
  const initialSource = src && src.trim().length > 0 ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSource);

  useEffect(() => {
    setCurrentSrc(src && src.trim().length > 0 ? src : fallbackSrc);
  }, [fallbackSrc, src]);

  return <Image {...props} src={currentSrc} alt={alt} onError={() => setCurrentSrc(fallbackSrc)} />;
};
