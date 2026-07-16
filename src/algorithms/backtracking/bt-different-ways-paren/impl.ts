export interface DwpHooks {
  onCombine?: (l: number, op: string, r: number, res: number) => void;
  onResult?: (vals: number[]) => void;
}
export function diffWaysToCompute(expr: string, hooks: DwpHooks = {}): number[] {
  const go = (s: string): number[] => {
    const out: number[] = [];
    let hasOp = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i]!;
      if (ch === '+' || ch === '-' || ch === '*') {
        hasOp = true;
        const left = go(s.slice(0, i));
        const right = go(s.slice(i + 1));
        for (const l of left)
          for (const r of right) {
            const v = ch === '+' ? l + r : ch === '-' ? l - r : l * r;
            out.push(v);
            hooks.onCombine?.(l, ch, r, v);
          }
      }
    }
    if (!hasOp) return [Number(s)];
    return out;
  };
  const r = go(expr);
  hooks.onResult?.(r);
  return r;
}
