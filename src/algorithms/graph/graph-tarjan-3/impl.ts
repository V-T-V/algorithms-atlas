// =============================================================================
// Tarjan SCC
// =============================================================================

export interface TarjanGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface TarjanHooks {
  onDiscover?: (u: string, dfn: number) => void;
  onLow?: (u: string, low: number) => void;
  onSCC?: (members: string[]) => void;
  onDone?: (sccs: string[][]) => void;
}

export function tarjanSCC(input: TarjanGraphInput, hooks: TarjanHooks = {}): string[][] {
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) adj.get(e.from)?.push(e.to);
  for (const list of adj.values()) list.sort();
  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  let timer = 0;
  const sccs: string[][] = [];

  const strongconnect = (u: string): void => {
    dfn.set(u, timer);
    low.set(u, timer);
    timer++;
    stack.push(u);
    onStack.add(u);
    hooks.onDiscover?.(u, dfn.get(u)!);
    for (const v of adj.get(u) ?? []) {
      if (!dfn.has(v)) {
        strongconnect(v);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));
      } else if (onStack.has(v)) {
        low.set(u, Math.min(low.get(u)!, dfn.get(v)!));
      }
    }
    hooks.onLow?.(u, low.get(u)!);
    if (low.get(u) === dfn.get(u)) {
      const comp: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        comp.push(w);
      } while (w !== u);
      sccs.push(comp);
      hooks.onSCC?.(comp);
    }
  };

  for (const n of input.nodes) {
    if (!dfn.has(n)) strongconnect(n);
  }
  hooks.onDone?.(sccs);
  return sccs;
}
