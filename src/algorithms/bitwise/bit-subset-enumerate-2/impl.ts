export interface SubsetHooks {
  onSubset?: (sub: number) => void;
}
export function enumerateSubsets(mask: number, hooks: SubsetHooks = {}): number[] {
  const out: number[] = [];
  let sub = mask | 0;
  if (sub === 0) return out;
  do {
    out.push(sub >>> 0);
    hooks.onSubset?.(sub >>> 0);
    sub = ((sub - 1) & mask) | 0;
  } while (sub !== mask && sub !== 0 && out.length < 100000);
  return out;
}
