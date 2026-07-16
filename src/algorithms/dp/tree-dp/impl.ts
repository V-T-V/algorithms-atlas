// =============================================================================
// 树形 DP（Tree DP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：树的最大权独立集（不相邻地选若干节点，权和最大）。
// =============================================================================

/** 树输入：节点带权；以 children 表示（无根树，调用者给出根）。 */
export interface TreeDpInput {
  nodes: ReadonlyArray<{ id: string; weight: number; children?: readonly string[] }>;
  root: string;
}

/** 树形 DP 执行过程中的事件钩子。任一可选。 */
export interface TreeDpHooks {
  /** 进入节点 u 的后序 DFS（即将处理子树）。 */
  onEnter?: (u: string, parent: string | null) => void;
  /** 节点 u 的 dp 值已算出。 */
  onSolve?: (u: string, pick: number, skip: number, choice: 'pick' | 'skip') => void;
  /** 算法完成：最大权和与被选节点集合。 */
  onDone?: (maxWeight: number, picked: string[]) => void;
}

/** 树形 DP 结果。 */
export interface TreeDpResult {
  /** 最大权和（独立集）。 */
  maxWeight: number;
  /** 被选中的节点 id 列表。 */
  picked: string[];
}

/**
 * 树形 DP：树的最大权独立集。
 *
 * 状态（后序 DFS）：
 * - `dpPick(u)` = 选 u 时 u 子树最大权和 = weight(u) + Σ dpSkip(v)（v 是 u 的孩子）。
 * - `dpSkip(u)` = 不选 u 时 = Σ max(dpPick(v), dpSkip(v))。
 * - 根处取 max(pick, skip)；按决策回溯选出节点集合。
 *
 * @param input 带权树
 * @param hooks 可选事件钩子
 * @returns 最大权独立集的权和与节点集
 */
export function treeDp(input: TreeDpInput, hooks: TreeDpHooks = {}): TreeDpResult {
  // 构造 id → node 映射与 children 映射
  const nodeOf = new Map<string, { id: string; weight: number; children: readonly string[] }>();
  for (const nd of input.nodes)
    nodeOf.set(nd.id, { id: nd.id, weight: nd.weight, children: nd.children ?? [] });
  if (!nodeOf.has(input.root)) return { maxWeight: 0, picked: [] };

  // 记录每个节点的 dp 值与决策
  const pickVal = new Map<string, number>();
  const skipVal = new Map<string, number>();
  const picked = new Set<string>();

  const dfs = (u: string, parent: string | null): { pick: number; skip: number } => {
    const node = nodeOf.get(u)!;
    hooks.onEnter?.(u, parent);
    let pick = node.weight;
    let skip = 0;
    for (const c of node.children) {
      if (!nodeOf.has(c)) continue;
      const sub = dfs(c, u);
      pick += sub.skip;
      skip += Math.max(sub.pick, sub.skip);
    }
    pickVal.set(u, pick);
    skipVal.set(u, skip);
    const choice: 'pick' | 'skip' = pick >= skip ? 'pick' : 'skip';
    hooks.onSolve?.(u, pick, skip, choice);
    return { pick, skip };
  };

  const root = input.root;
  dfs(root, null);

  // 自顶向下按决策回溯：选 pick 当且仅当 pick > skip（等号时倾向选根以最大化）
  const collect = (u: string, parentPicked: boolean): void => {
    const node = nodeOf.get(u)!;
    const p = pickVal.get(u)!;
    const s = skipVal.get(u)!;
    // 若父节点未选，本节点可自由决定；选更优者
    const chooseThis = !parentPicked && p >= s;
    if (chooseThis) picked.add(u);
    for (const c of node.children) collect(c, chooseThis);
  };
  collect(root, false);

  const pickedList = picked;
  const maxWeight = Math.max(pickVal.get(root) ?? 0, skipVal.get(root) ?? 0);
  hooks.onDone?.(maxWeight, [...pickedList]);
  return { maxWeight, picked: [...pickedList] };
}
