"use client";

import { useEffect, useRef } from "react";
import { getCurrentUser, isAuthApiConfigured, refreshSession } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

export const AuthBootstrap = () => {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setCheckingSession = useAuthStore((state) => state.setCheckingSession);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!hasHydrated || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    let cancelled = false;

    const verifySession = async () => {
      setCheckingSession(true);

      try {
        if (!isAuthApiConfigured()) {
          return;
        }

        if (accessToken) {
          try {
            const user = await getCurrentUser(accessToken);

            if (!cancelled) {
              setSession({ accessToken, user });
            }

            return;
          } catch {
            // Fall through to refresh when the access token can no longer be verified.
          }
        }

        const session = await refreshSession();

        if (!cancelled) {
          setSession(session);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    };

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [accessToken, clearSession, hasHydrated, setCheckingSession, setSession]);

  return null;
};
