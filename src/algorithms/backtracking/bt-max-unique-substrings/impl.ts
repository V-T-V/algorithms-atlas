export interface MusHooks {
  onCut?: (s: string) => void;
  onResult?: (max: number) => void;
}
export function maxUniqueSplit(s: string, hooks: MusHooks = {}): number {
  let max = 0;
  const seen = new Set<string>();
  const go = (start: number) => {
    if (start === s.length) {
      max = Math.max(max, seen.size);
      return;
    }
    for (let end = start + 1; end <= s.length; end++) {
      const sub = s.slice(start, end);
      if (seen.has(sub)) continue;
      seen.add(sub);
      hooks.onCut?.(sub);
      go(end);
      seen.delete(sub);
    }
  };
  go(0);
  hooks.onResult?.(max);
  return max;
}
