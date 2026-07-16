// =============================================================================
// 树上欧拉序（Euler Tour / DFS 入序 + 完整欧拉环游）
// 输入：无根树（用边表示，根默认为第一个节点）。
// 输出：进入时间戳 in/out、进入序 dfn[]、完整欧拉环游 euler[]（含回访）。
// =============================================================================

export interface TreeInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root?: string;
}

export interface EulerHooks {
  onEnter?: (v: string, inTime: number) => void;
  onExit?: (v: string, outTime: number) => void;
  onResult?: (tour: {
    dfn: string[];
    euler: string[];
    inTime: Map<string, number>;
    outTime: Map<string, number>;
  }) => void;
}

export interface EulerResult {
  /** 进入序（每个节点首次访问，长度 V）。 */
  dfn: string[];
  /** 完整欧拉环游（进入 + 子树返回后再次记录，长度 2V-1）。 */
  euler: string[];
  inTime: Map<string, number>;
  outTime: Map<string, number>;
}

export function eulerTourGraph(input: TreeInput, hooks: EulerHooks = {}): EulerResult {
  const { nodes, edges } = input;
  const root = input.root ?? nodes[0] ?? '';

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const dfn: string[] = [];
  const euler: string[] = [];
  const inTime = new Map<string, number>();
  const outTime = new Map<string, number>();
  const visited = new Set<string>();
  let timer = 0;

  const dfs = (u: string, parent: string | null): void => {
    visited.add(u);
    timer++;
    inTime.set(u, timer);
    dfn.push(u);
    euler.push(u);
    hooks.onEnter?.(u, timer);

    for (const v of adj.get(u) ?? []) {
      if (v === parent || visited.has(v)) continue;
      dfs(v, u);
      // 从子树返回，欧拉环游中再次记录当前节点
      euler.push(u);
    }

    outTime.set(u, timer);
    hooks.onExit?.(u, timer);
  };

  if (adj.has(root)) dfs(root, null);
  // 处理森林：剩余未访问节点
  for (const n of nodes) {
    if (!visited.has(n)) dfs(n, null);
  }

  hooks.onResult?.({ dfn, euler, inTime, outTime });
  return { dfn, euler, inTime, outTime };
}
