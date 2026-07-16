// CFG 歧义检测 · 纯算法实现
export interface Rule {
  head: string;
  alts: string[][];
}
export interface AmbiguityWarning {
  rule: string;
  reason: string;
}

export function detectAmbiguity(rules: Rule[]): AmbiguityWarning[] {
  const out: AmbiguityWarning[] = [];
  for (const r of rules) {
    const firstMap = new Map<string, number>();
    for (const alt of r.alts) {
      const f = alt[0] ?? 'ε';
      firstMap.set(f, (firstMap.get(f) ?? 0) + 1);
    }
    for (const [f, c] of firstMap)
      if (c > 1) out.push({ rule: r.head, reason: `multiple alternatives start with "${f}"` });
    const hasLeft = r.alts.some((a) => a[0] === r.head);
    const hasRight = r.alts.some((a) => a[a.length - 1] === r.head);
    if (hasLeft && hasRight)
      out.push({ rule: r.head, reason: 'both left- and right-recursive — likely ambiguous' });
  }
  return out;
}
