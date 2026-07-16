export interface EqHooks {
  onUnion?: (a: string, b: string) => void;
  onResult?: (ok: boolean) => void;
}
export function equationsPossible(equations: string[], hooks: EqHooks = {}): boolean {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    const p = parent.get(x)!;
    if (p === x) return x;
    parent.set(x, find(p));
    return parent.get(x)!;
  };
  const union = (a: string, b: string) => {
    parent.set(find(a), find(b));
  };
  for (const e of equations)
    if (e[1] === '=') {
      hooks.onUnion?.(e[0]!, e[3]!);
      union(e[0]!, e[3]!);
    }
  for (const e of equations)
    if (e[1] === '!') {
      if (find(e[0]!) === find(e[3]!)) {
        hooks.onResult?.(false);
        return false;
      }
    }
  hooks.onResult?.(true);
  return true;
}
