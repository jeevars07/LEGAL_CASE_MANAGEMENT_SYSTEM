import { useEffect, useState } from 'react';

/**
 * Simulates a short network fetch so pages can demonstrate skeleton and error states.
 */
export function useSimulatedLoad(delay = 550): {loading: boolean;error: boolean;retry: () => void;} {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const t = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(t);
  }, [delay, nonce]);

  return { loading, error, retry: () => setNonce((n) => n + 1) };
}