const EPS = 1e-6;
export interface G24Hooks {
  onMerge?: (a: number, b: number, r: number) => void;
  onResult?: (ok: boolean) => void;
}
export function judgePoint24(cards: number[], hooks: G24Hooks = {}): boolean {
  const go = (nums: number[]): boolean => {
    if (nums.length === 1) return Math.abs(nums[0]! - 24) < EPS;
    for (let i = 0; i < nums.length; i++)
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;
        const rest = nums.filter((_, k) => k !== i && k !== j);
        const a = nums[i]!,
          b = nums[j]!;
        const cands = [a + b, a - b, a * b];
        if (Math.abs(b) > EPS) cands.push(a / b);
        for (const r of cands) {
          hooks.onMerge?.(a, b, r);
          if (go([...rest, r])) return true;
        }
      }
    return false;
  };
  const ok = go([...cards]);
  hooks.onResult?.(ok);
  return ok;
}
