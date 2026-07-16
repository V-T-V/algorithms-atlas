export interface MsHooks {
  onPlace?: (idx: number, side: number) => void;
  onResult?: (ok: boolean) => void;
}
export function makesquare(matchsticks: number[], hooks: MsHooks = {}): boolean {
  const sum = matchsticks.reduce((a, b) => a + b, 0);
  if (sum % 4 !== 0) return false;
  const target = sum / 4;
  const sides = new Array(4).fill(0);
  const sorted = [...matchsticks].sort((a, b) => b - a);
  const go = (i: number): boolean => {
    if (i === sorted.length) return sides.every((s) => s === target);
    for (let s = 0; s < 4; s++) {
      if (sides[s]! + sorted[i]! > target) continue;
      if (s > 0 && sides[s] === sides[s - 1]) continue;
      sides[s] += sorted[i]!;
      hooks.onPlace?.(i, s);
      if (go(i + 1)) return true;
      sides[s] -= sorted[i]!;
    }
    return false;
  };
  const ok = go(0);
  hooks.onResult?.(ok);
  return ok;
}
