export interface Account {
  name: string;
  emails: string[];
}
export interface AmHooks {
  onMerge?: (email: string, root: string) => void;
  onResult?: (n: number) => void;
}
export function accountsMerge(accounts: Account[], hooks: AmHooks = {}): Account[] {
  const owner = new Map<string, string>();
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
  for (const acc of accounts) {
    const first = acc.emails[0]!;
    owner.set(first, acc.name);
    for (let i = 1; i < acc.emails.length; i++) {
      owner.set(acc.emails[i]!, acc.name);
      union(first, acc.emails[i]!);
    }
  }
  const groups = new Map<string, Set<string>>();
  for (const acc of accounts)
    for (const e of acc.emails) {
      const r = find(e);
      hooks.onMerge?.(e, r);
      if (!groups.has(r)) groups.set(r, new Set());
      groups.get(r)!.add(e);
    }
  const result: Account[] = [];
  for (const [root, set] of groups)
    result.push({ name: owner.get(root)!, emails: [...set].sort() });
  hooks.onResult?.(result.length);
  return result;
}
