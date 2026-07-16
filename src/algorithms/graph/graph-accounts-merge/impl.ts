// =============================================================================
// 账户合并 · 纯算法实现（并查集）
// =============================================================================

export interface AccountsMergeHooks {
  onUnion?: (a: string, b: string) => void;
  onResult?: (mergedCount: number) => void;
}

class StrUF {
  parent = new Map<string, string>();
  find(x: string): string {
    if ((this.parent.get(x) ?? x) === x) return x;
    const r = this.find(this.parent.get(x) ?? x);
    this.parent.set(x, r);
    return r;
  }
  make(x: string): void {
    if (!this.parent.has(x)) this.parent.set(x, x);
  }
  union(a: string, b: string): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    this.parent.set(rb, ra);
    return true;
  }
}

export function accountsMerge(accounts: string[][], hooks: AccountsMergeHooks = {}): string[][] {
  const uf = new StrUF();
  const emailToName = new Map<string, string>();
  for (const acc of accounts) {
    const name = acc[0]!;
    for (let i = 1; i < acc.length; i++) {
      const email = acc[i]!;
      uf.make(email);
      emailToName.set(email, name);
      uf.union(acc[1]!, email);
      if (i > 1) hooks.onUnion?.(acc[1]!, email);
    }
  }
  // 按根聚合
  const groups = new Map<string, Set<string>>();
  for (const email of emailToName.keys()) {
    const root = uf.find(email);
    if (!groups.has(root)) groups.set(root, new Set());
    groups.get(root)!.add(email);
  }
  const result: string[][] = [];
  for (const [root, emails] of groups) {
    const name = emailToName.get(root)!;
    const sortedEmails = [...emails].sort();
    result.push([name, ...sortedEmails]);
  }
  hooks.onResult?.(result.length);
  return result;
}
