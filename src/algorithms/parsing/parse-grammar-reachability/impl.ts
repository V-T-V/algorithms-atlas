// 文法可达性分析 · 纯算法实现
export interface Rule {
  head: string;
  syms: string[];
}
export function isNonTerminal(s: string): boolean {
  return /^[A-Z]/.test(s);
}

export interface ReachResult {
  reachable: Set<string>;
  unreachable: string[];
}

export function analyzeReachability(rules: Rule[], start: string): ReachResult {
  const heads = new Set(rules.map((r) => r.head));
  const edges = new Map<string, string[]>();
  for (const r of rules) {
    const arr = edges.get(r.head) ?? [];
    for (const s of r.syms) if (isNonTerminal(s) && heads.has(s)) arr.push(s);
    edges.set(r.head, arr);
  }
  const reachable = new Set<string>([start]);
  const queue = [start];
  while (queue.length) {
    const h = queue.shift()!;
    for (const n of edges.get(h) ?? [])
      if (!reachable.has(n)) {
        reachable.add(n);
        queue.push(n);
      }
  }
  const unreachable = [...heads].filter((h) => !reachable.has(h));
  return { reachable, unreachable };
}
