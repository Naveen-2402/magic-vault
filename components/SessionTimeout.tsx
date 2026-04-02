'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 Minutes

export default function SessionTimeout() {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    // 1. Wipe the PIN from volatile memory
    sessionStorage.removeItem('vault_key_fragment');
    // 2. Remove the auth cookie
    Cookies.remove('auth_session');
    // 3. Force redirect to landing page
    router.push('/');
    // 4. Optional: Refresh to ensure state is totally reset
    router.refresh();
  }, [router]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, TIMEOUT_DURATION);
    };

    // Events that prove the user is still there
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Add listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start the initial timer
    resetTimer();

    // Clean up on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [handleLogout]);

  return null; // This component doesn't render anything
}