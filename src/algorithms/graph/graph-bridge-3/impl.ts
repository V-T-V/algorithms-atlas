// =============================================================================
// 桥 / 割边
// =============================================================================

export interface BridgeGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface BridgeHooks {
  onDiscover?: (u: string, dfn: number) => void;
  onLow?: (u: string, low: number) => void;
  onBridge?: (u: string, v: string) => void;
  onDone?: (bridges: Array<{ u: string; v: string }>) => void;
}

export function findBridges(
  input: BridgeGraphInput,
  hooks: BridgeHooks = {},
): Array<{ u: string; v: string }> {
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  // 保留边 id 用于跳过「重边 / 父边」
  const edgeList: Array<{ from: string; to: string }> = [];
  for (const e of input.edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
    edgeList.push(e);
  }
  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  let timer = 0;
  const bridges: Array<{ u: string; v: string }> = [];

  const dfs = (u: string, parent: string | null): void => {
    dfn.set(u, timer);
    low.set(u, timer);
    timer++;
    hooks.onDiscover?.(u, dfn.get(u)!);
    for (const v of adj.get(u) ?? []) {
      if (!dfn.has(v)) {
        dfs(v, u);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));
        if (low.get(v)! > dfn.get(u)!) {
          bridges.push({ u, v });
          hooks.onBridge?.(u, v);
        }
      } else if (v !== parent) {
        low.set(u, Math.min(low.get(u)!, dfn.get(v)!));
      }
    }
    hooks.onLow?.(u, low.get(u)!);
  };

  for (const n of input.nodes) if (!dfn.has(n)) dfs(n, null);
  hooks.onDone?.(bridges);
  return bridges;
}
