// ε-NFA · 纯算法实现
export interface EpsilonNfa {
  states: string[];
  alphabet: string[];
  edges: Array<{ from: string; input: string | null; to: string }>; // null = ε
  start: string;
  accept: string[];
}

export function epsilonClosure(nfa: EpsilonNfa, states: Set<string>): Set<string> {
  const out = new Set(states);
  const stack = [...states];
  while (stack.length) {
    const s = stack.pop()!;
    for (const e of nfa.edges) {
      if (e.from === s && e.input === null && !out.has(e.to)) {
        out.add(e.to);
        stack.push(e.to);
      }
    }
  }
  return out;
}

export function nfaRun(nfa: EpsilonNfa, input: string[]): boolean {
  let cur = epsilonClosure(nfa, new Set([nfa.start]));
  for (const a of input) {
    const next = new Set<string>();
    for (const s of cur)
      for (const e of nfa.edges) if (e.from === s && e.input === a) next.add(e.to);
    cur = epsilonClosure(nfa, next);
    if (cur.size === 0) return false;
  }
  return [...cur].some((s) => nfa.accept.includes(s));
}
