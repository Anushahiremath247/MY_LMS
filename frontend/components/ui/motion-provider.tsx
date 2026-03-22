"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </MotionConfig>
  </LazyMotion>
);
