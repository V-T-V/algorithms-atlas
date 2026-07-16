// DFA 最小化 (Hopcroft 简化版) · 纯算法实现
export interface DfaSpec {
  states: string[];
  alphabet: string[];
  delta: Record<string, Record<string, string>>;
  start: string;
  accept: string[];
}

export function minimizeDfa(dfa: DfaSpec): string[][] {
  const accept = new Set(dfa.accept);
  let parts: string[][] = [[], []];
  for (const s of dfa.states) (accept.has(s) ? parts[0]! : parts[1]!).push(s);
  if (parts[1]!.length === 0) parts = [parts[0]!];
  let changed = true;
  while (changed) {
    changed = false;
    const next: string[][] = [];
    for (const part of parts) {
      if (part.length <= 1) {
        next.push(part);
        continue;
      }
      const groups = new Map<string, string[]>();
      for (const s of part) {
        const sig = dfa.alphabet
          .map((a) => parts.findIndex((p) => p.includes(dfa.delta[s]![a]!)))
          .join(',');
        const g = groups.get(sig) ?? [];
        g.push(s);
        groups.set(sig, g);
      }
      for (const g of groups.values()) next.push(g);
      if (groups.size > 1) changed = true;
    }
    parts = next;
  }
  return parts.filter((p) => p.length > 0);
}
