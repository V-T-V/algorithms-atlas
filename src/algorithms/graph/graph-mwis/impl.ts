// =============================================================================
// 树上最大权独立集 · 纯算法实现
// =============================================================================

export interface TreeInput {
  nodes: ReadonlyArray<{ id: string; weight: number }>;
  /** 0 为根；parent[i] 给出节点 i 的父节点 id，根用 null。这里用 children 表示。 */
  children: ReadonlyArray<{ parent: string; child: string }>;
  root: string;
}

export interface MwisHooks {
  onNode?: (id: string, take: number, skip: number) => void;
  onDone?: (best: number, chosen: string[]) => void;
}

export interface MwisResult {
  best: number;
  chosen: string[];
}

export function treeMwis(input: TreeInput, hooks: MwisHooks = {}): MwisResult {
  const w = new Map<string, number>();
  for (const n of input.nodes) w.set(n.id, n.weight);
  const children = new Map<string, string[]>();
  for (const n of input.nodes) children.set(n.id, []);
  for (const e of input.children) children.get(e.parent)?.push(e.child);

  const takeMap = new Map<string, number>();
  const skipMap = new Map<string, number>();

  const dfs = (u: string): [number, number] => {
    let take = w.get(u) ?? 0;
    let skip = 0;
    for (const c of children.get(u) ?? []) {
      const [ct, cs] = dfs(c);
      take += cs;
      skip += Math.max(ct, cs);
    }
    takeMap.set(u, take);
    skipMap.set(u, skip);
    hooks.onNode?.(u, take, skip);
    return [take, skip];
  };
  const [rootTake, rootSkip] = dfs(input.root);
  const best = Math.max(rootTake, rootSkip);

  // 回溯选中的节点
  const chosen: string[] = [];
  const trace = (u: string, parentTaken: boolean): void => {
    if (parentTaken) {
      for (const c of children.get(u) ?? []) trace(c, false);
      return;
    }
    const t = takeMap.get(u)!;
    const s = skipMap.get(u)!;
    const takeThis = t >= s;
    if (takeThis) chosen.push(u);
    for (const c of children.get(u) ?? []) trace(c, takeThis);
  };
  trace(input.root, false);
  hooks.onDone?.(best, chosen);
  return { best, chosen };
}
