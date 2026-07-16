export interface StHooks {
  onUse?: (i: number) => void;
  onResult?: (min: number) => void;
}
export function minStickers(stickers: string[], target: string, hooks: StHooks = {}): number {
  const cnt = (w: string): Map<string, number> => {
    const m = new Map<string, number>();
    for (const ch of w) m.set(ch, (m.get(ch) ?? 0) + 1);
    return m;
  };
  const stk = stickers.map(cnt);
  const tgt = cnt(target);
  let best = Infinity;
  const go = (remain: Map<string, number>, used: number) => {
    const keys = [...remain.keys()].filter((k) => (remain.get(k) ?? 0) > 0);
    if (keys.length === 0) {
      best = Math.min(best, used);
      return;
    }
    if (used >= best) return;
    const first = keys[0]!;
    for (let i = 0; i < stickers.length; i++) {
      if (!stk[i]!.has(first)) continue;
      const nr = new Map(remain);
      for (const [ch, c] of stk[i]!) nr.set(ch, (nr.get(ch) ?? 0) - c);
      hooks.onUse?.(i);
      go(nr, used + 1);
    }
  };
  go(tgt, 0);
  const r = best === Infinity ? -1 : best;
  hooks.onResult?.(r);
  return r;
}
