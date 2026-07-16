export interface PyHooks {
  onPick?: (ch: string) => void;
  onResult?: (ok: boolean) => void;
}
export function pyramidTransition(bottom: string, allowed: string[], hooks: PyHooks = {}): boolean {
  const map = new Map<string, string[]>();
  for (const a of allowed) {
    const key = a.slice(0, 2);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a[2]!);
  }
  const go = (row: string): boolean => {
    if (row.length === 1) return true;
    const next: string[] = [];
    const build = (i: number, cur: string): boolean => {
      if (i === row.length - 1) return go(cur);
      const key = row[i]! + row[i + 1]!;
      const tops = map.get(key);
      if (!tops) return false;
      for (const t of tops) {
        hooks.onPick?.(t);
        if (build(i + 1, cur + t)) return true;
      }
      return false;
    };
    return build(0, '');
  };
  const ok = go(bottom);
  hooks.onResult?.(ok);
  return ok;
}
