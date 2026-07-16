export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export interface ArtHooks {
  onArticulation?: (v: string) => void;
  onResult?: (pts: string[]) => void;
}
export function articulationPoints(g: GraphInput, hooks: ArtHooks = {}): string[] {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  const disc = new Map<string, number>(),
    low = new Map<string, number>();
  const isArt = new Set<string>();
  let timer = 0;
  const dfs = (u: string, parent: string | null) => {
    disc.set(u, timer);
    low.set(u, timer);
    timer++;
    let children = 0;
    for (const v of adj.get(u) ?? []) {
      if (!disc.has(v)) {
        children++;
        dfs(v, u);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));
        if ((parent === null && children > 1) || (parent !== null && low.get(v)! >= disc.get(u)!)) {
          isArt.add(u);
          hooks.onArticulation?.(u);
        }
      } else if (v !== parent) low.set(u, Math.min(low.get(u)!, disc.get(v)!));
    }
  };
  for (const s of g.nodes) if (!disc.has(s)) dfs(s, null);
  const pts = [...isArt];
  hooks.onResult?.(pts);
  return pts;
}
