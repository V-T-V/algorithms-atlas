// =============================================================================
// 割点 / 关节点
// =============================================================================

export interface BridgeGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface CutHooks {
  onDiscover?: (u: string, dfn: number) => void;
  onCut?: (u: string) => void;
  onDone?: (cuts: string[]) => void;
}

export function findCutVertices(input: BridgeGraphInput, hooks: CutHooks = {}): string[] {
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }
  for (const list of adj.values()) list.sort();
  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  let timer = 0;
  const cuts = new Set<string>();

  const dfs = (u: string, parent: string | null): void => {
    dfn.set(u, timer);
    low.set(u, timer);
    timer++;
    hooks.onDiscover?.(u, dfn.get(u)!);
    let childCount = 0;
    for (const v of adj.get(u) ?? []) {
      if (!dfn.has(v)) {
        childCount++;
        dfs(v, u);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));
        if (parent !== null && low.get(v)! >= dfn.get(u)!) {
          cuts.add(u);
        }
      } else if (v !== parent) {
        low.set(u, Math.min(low.get(u)!, dfn.get(v)!));
      }
    }
    if (parent === null && childCount >= 2) cuts.add(u);
  };

  for (const n of input.nodes) if (!dfn.has(n)) dfs(n, null);
  for (const c of cuts) hooks.onCut?.(c);
  hooks.onDone?.([...cuts]);
  return [...cuts];
}
