"use client";

import { useCallback, useEffect, useState } from "react";

const PREFIX = "guest-quota:";
const MAX_GUEST_USES = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 jam

type Quota = { count: number; resetAt: number };

function read(key: string): Quota | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Quota;
    if (typeof parsed.count !== "number" || typeof parsed.resetAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function write(key: string, quota: Quota) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(quota));
  } catch {}
}

/**
 * Batas pemakaian tool untuk guest (disimpan lokal di browser).
 * User yang login (isGuest=false) tidak dibatasi.
 */
export function useGuestQuota(toolKey: string, isGuest: boolean, maxUses = MAX_GUEST_USES, windowMs = WINDOW_MS) {
  const [quota, setQuota] = useState<Quota | null>(null);

  useEffect(() => {
    if (!isGuest) return setQuota(null);
    const current = read(toolKey);
    const valid = current && current.resetAt > Date.now() ? current : { count: 0, resetAt: Date.now() + windowMs };
    write(toolKey, valid);
    setQuota(valid);
  }, [toolKey, isGuest, windowMs]);

  const consume = useCallback((): boolean => {
    if (!isGuest) return true;
    const current = read(toolKey);
    const valid = current && current.resetAt > Date.now() ? current : { count: 0, resetAt: Date.now() + windowMs };
    if (valid.count >= maxUses) {
      setQuota(valid);
      return false;
    }
    valid.count += 1;
    write(toolKey, valid);
    setQuota(valid);
    return true;
  }, [toolKey, isGuest, maxUses, windowMs]);

  const remaining = isGuest && quota ? Math.max(0, maxUses - quota.count) : null;
  const limited = isGuest && quota ? quota.count >= maxUses : false;
  const resetIn = isGuest && quota && limited ? Math.ceil((quota.resetAt - Date.now()) / 1000) : 0;

  return { remaining, limited, resetIn, consume };
}
