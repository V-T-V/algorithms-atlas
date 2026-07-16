// =============================================================================
// 强连通分量（SCC）· Tarjan 递归实现
// 维护 dfn/low 与节点栈；当 low[v]==dfn[v] 时弹栈得到一个 SCC。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface SccTarjanRecHooks {
  onDiscover?: (v: string, dfn: number) => void;
  onExamine?: (u: string, v: string, kind: 'tree' | 'back' | 'cross' | 'forward') => void;
  onUpdateLow?: (u: string, newLow: number) => void;
  onComponent?: (component: string[]) => void;
}

export interface SccTarjanRecResult {
  components: string[][];
}

export function sccTarjanRecursive(
  input: GraphInput,
  hooks: SccTarjanRecHooks = {},
): SccTarjanRecResult {
  const { nodes, edges } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
  }
  for (const list of adj.values()) list.sort();

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const components: string[][] = [];
  let timer = 0;

  const kindOf = (u: string, v: string): 'tree' | 'back' | 'cross' | 'forward' => {
    if (!dfn.has(v)) return 'tree';
    if (onStack.has(v)) return 'back';
    return (dfn.get(v)! ?? 0) > (dfn.get(u)! ?? 0) ? 'forward' : 'cross';
  };

  const dfs = (u: string): void => {
    timer++;
    dfn.set(u, timer);
    low.set(u, timer);
    stack.push(u);
    onStack.add(u);
    hooks.onDiscover?.(u, timer);

    for (const v of adj.get(u) ?? []) {
      const kind = kindOf(u, v);
      hooks.onExamine?.(u, v, kind);
      if (kind === 'tree') {
        dfs(v);
        const newLow = Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
      } else if (kind === 'back') {
        const newLow = Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity);
        if (newLow !== (low.get(u) ?? Infinity)) {
          low.set(u, newLow);
          hooks.onUpdateLow?.(u, newLow);
        }
      }
    }

    if (low.get(u) === dfn.get(u)) {
      const comp: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack.delete(w);
        comp.push(w);
      } while (w !== u);
      components.push(comp);
      hooks.onComponent?.(comp);
    }
  };

  for (const root of nodes) {
    if (!dfn.has(root)) dfs(root);
  }

  return { components };
}
