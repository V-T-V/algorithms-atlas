export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export interface BridgeHooks {
  onBridge?: (a: string, b: string) => void;
  onResult?: (bridges: Array<[string, string]>) => void;
}
export function findBridges(g: GraphInput, hooks: BridgeHooks = {}): Array<[string, string]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  const disc = new Map<string, number>(),
    low = new Map<string, number>();
  const bridges: Array<[string, string]> = [];
  let timer = 0;
  const dfs = (u: string, parent: string | null) => {
    disc.set(u, timer);
    low.set(u, timer);
    timer++;
    for (const v of adj.get(u) ?? []) {
      if (!disc.has(v)) {
        dfs(v, u);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));
        if (low.get(v)! > disc.get(u)!) {
          bridges.push([u, v]);
          hooks.onBridge?.(u, v);
        }
      } else if (v !== parent) low.set(u, Math.min(low.get(u)!, disc.get(v)!));
    }
  };
  for (const s of g.nodes) if (!disc.has(s)) dfs(s, null);
  hooks.onResult?.(bridges);
  return bridges;
}
