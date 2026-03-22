"use client";

import { m } from "framer-motion";

export const LearnerMascotIllustration = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`.trim()}>
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-[1.1/1] w-full max-w-[360px]"
    >
      <svg viewBox="0 0 360 320" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGlow" x1="42" y1="28" x2="308" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE4C6" />
            <stop offset="0.48" stopColor="#FFF4E7" />
            <stop offset="1" stopColor="#EAF5FF" />
          </linearGradient>
          <linearGradient id="bookWarm" x1="128" y1="214" x2="254" y2="282" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8C879" />
            <stop offset="1" stopColor="#F39C73" />
          </linearGradient>
          <linearGradient id="bookCool" x1="92" y1="236" x2="240" y2="294" gradientUnits="userSpaceOnUse">
            <stop stopColor="#89BBFF" />
            <stop offset="1" stopColor="#4C83F6" />
          </linearGradient>
          <linearGradient id="screenFill" x1="156" y1="144" x2="245" y2="214" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7CC5FF" />
            <stop offset="1" stopColor="#5A7CF7" />
          </linearGradient>
          <radialGradient id="shadowGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(182 286) rotate(90) scale(16 98)">
            <stop stopColor="#B6C5D8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#B6C5D8" stopOpacity="0" />
          </radialGradient>
          <filter id="softShadow" x="34" y="16" width="292" height="282" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#B8C2CE" floodOpacity="0.32" />
          </filter>
        </defs>

        <rect x="44" y="26" width="272" height="238" rx="42" fill="url(#skyGlow)" />
        <circle cx="64" cy="72" r="6" fill="#F59E7A" />
        <circle cx="286" cy="66" r="5" fill="#5E7CF7" fillOpacity="0.85" />
        <circle cx="298" cy="206" r="7" fill="#F7C45B" fillOpacity="0.85" />
        <circle cx="92" cy="224" r="9" fill="#FFFFFF" fillOpacity="0.9" />
        <circle cx="264" cy="104" r="4.5" fill="#FFFFFF" />
        <ellipse cx="182" cy="286" rx="98" ry="16" fill="url(#shadowGlow)" />

        <g filter="url(#softShadow)">
          <rect x="108" y="226" width="144" height="30" rx="16" fill="url(#bookWarm)" />
          <rect x="86" y="248" width="174" height="26" rx="14" fill="url(#bookCool)" />
          <rect x="148" y="208" width="102" height="22" rx="12" fill="#A9D7A3" />
        </g>

        <path d="M192 66C222.9 66 248 91.1 248 122V192C248 222.9 222.9 248 192 248H166C135.1 248 110 222.9 110 192V122C110 91.1 135.1 66 166 66H192Z" fill="#F8FAFC" />
        <ellipse cx="132" cy="92" rx="18" ry="20" fill="#27272A" />
        <ellipse cx="218" cy="92" rx="18" ry="20" fill="#27272A" />
        <ellipse cx="152" cy="136" rx="20" ry="24" fill="#2F2F36" />
        <ellipse cx="204" cy="136" rx="20" ry="24" fill="#2F2F36" />
        <ellipse cx="178" cy="182" rx="42" ry="38" fill="#FDFDFD" />
        <ellipse cx="177" cy="163" rx="13" ry="10" fill="#2C2C33" />
        <path d="M167 178C170.1 182 173.9 184 178.5 184C183.2 184 187 182 190 178" stroke="#2C2C33" strokeWidth="4" strokeLinecap="round" />
        <circle cx="152" cy="164" r="6" fill="#F8C7C5" />
        <circle cx="205" cy="164" r="6" fill="#F8C7C5" />

        <rect x="136" y="194" width="92" height="48" rx="18" fill="#1E293B" />
        <rect x="144" y="200" width="76" height="34" rx="12" fill="url(#screenFill)" />
        <path d="M182 206L188 218H176L182 206Z" fill="#FFFFFF" fillOpacity="0.92" />

        <path d="M126 185C111 198 100 213 98 232" stroke="#2F2F36" strokeWidth="18" strokeLinecap="round" />
        <path d="M234 184C251 198 262 214 264 232" stroke="#2F2F36" strokeWidth="18" strokeLinecap="round" />
        <path d="M156 238C146 250 144 262 148 277" stroke="#2F2F36" strokeWidth="18" strokeLinecap="round" />
        <path d="M206 238C216 250 220 263 216 280" stroke="#2F2F36" strokeWidth="18" strokeLinecap="round" />

        <circle cx="146" cy="283" r="14" fill="#FDFDFD" />
        <circle cx="146" cy="283" r="6" fill="#F6C4C4" />
        <circle cx="220" cy="283" r="14" fill="#FDFDFD" />
        <circle cx="220" cy="283" r="6" fill="#F6C4C4" />

        <path d="M144 74C154 52 170 42 191 42C213 42 230 51 238 71C223 62 210 58 199 58C186 58 167 63 144 74Z" fill="#D38C4A" />
        <path d="M229 77C236 66 247 61 261 64" stroke="#D38C4A" strokeWidth="18" strokeLinecap="round" />
      </svg>
    </m.div>
  </div>
);
