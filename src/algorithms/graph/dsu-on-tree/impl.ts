// =============================================================================
// 树上启发式合并（DSU on Tree / Sack）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典应用：对每个节点 u，求其子树内各类颜色（值）的出现统计 / 不同值个数。
// 思路：先做一次 DFS 求重儿子（size 最大）；再 DFS，先轻儿子（算完即清），
//       再重儿子（保留桶），最后把当前子树（除重儿子子树）的贡献并入，得到 u 的答案。
// =============================================================================

/** 树输入：节点 id + 每点颜色/值；edges 为无向边（构成一棵树）。 */
export interface GraphInput {
  nodes: readonly string[];
  /** 每个节点的颜色/值（与 nodes 同序）。 */
  values: readonly number[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  /** 根节点。 */
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface DsuOnTreeHooks {
  /** 进入节点 u 的子树处理。 */
  onEnter?: (u: string) => void;
  /** 确定 u 的重儿子为 heavy。 */
  onHeavyChild?: (u: string, heavy: string | null) => void;
  /** 把节点 w 的颜色贡献加入桶（add=true 加入，false 移除）。 */
  onApply?: (w: string, add: boolean) => void;
  /** 计算完 u 的答案：distinct 为子树内不同颜色数。 */
  onAnswer?: (u: string, distinct: number) => void;
  /** 清空桶。 */
  onClear?: () => void;
}

export interface DsuOnTreeResult {
  /** 每个节点子树内的不同颜色数。 */
  distinct: Map<string, number>;
}

/**
 * 树上启发式合并：求每个节点子树内不同颜色的个数。
 *
 * @param input 树 + 颜色 + 根
 * @param hooks 可选事件钩子
 * @returns 每节点子树的不同颜色数
 */
export function dsuOnTree(input: GraphInput, hooks: DsuOnTreeHooks = {}): DsuOnTreeResult {
  const { nodes, values, edges, root } = input;
  const valueOf = new Map<string, number>();
  nodes.forEach((n, i) => valueOf.set(n, values[i] ?? 0));

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const size = new Map<string, number>();
  const heavy = new Map<string, string | null>();
  const parent = new Map<string, string | null>();

  // 第一遍 DFS：求 size 与 heavy
  const dfs1 = (u: string, par: string | null): void => {
    parent.set(u, par);
    size.set(u, 1);
    heavy.set(u, null);
    let maxSub = 0;
    for (const v of adj.get(u) ?? []) {
      if (v === par) continue;
      dfs1(v, u);
      size.set(u, (size.get(u) ?? 0) + (size.get(v) ?? 0));
      if ((size.get(v) ?? 0) > maxSub) {
        maxSub = size.get(v) ?? 0;
        heavy.set(u, v);
      }
    }
  };
  if (nodes.includes(root)) dfs1(root, null);

  // 颜色计数桶与当前不同颜色数
  const cnt = new Map<number, number>();
  let distinct = 0;

  const add = (w: string): void => {
    const c = valueOf.get(w) ?? 0;
    const before = cnt.get(c) ?? 0;
    if (before === 0) distinct++;
    cnt.set(c, before + 1);
    hooks.onApply?.(w, true);
  };
  const remove = (w: string): void => {
    const c = valueOf.get(w) ?? 0;
    const before = cnt.get(c) ?? 0;
    if (before === 1) distinct--;
    cnt.set(c, before - 1);
    hooks.onApply?.(w, false);
  };

  // 把 u 子树内（跳过 skip 子树）所有节点加入桶
  const addSubtree = (u: string, par: string | null, skip: string | null): void => {
    add(u);
    for (const v of adj.get(u) ?? []) {
      if (v === par || v === skip) continue;
      addSubtree(v, u, skip);
    }
  };

  const answer = new Map<string, number>();
  const keepHeavy = new Set<string>(); // 哪些节点的重儿子答案要保留桶

  const dfs2 = (u: string, par: string | null, keep: boolean): void => {
    hooks.onEnter?.(u);
    // 先处理轻儿子：算完清空
    for (const v of adj.get(u) ?? []) {
      if (v === par || v === heavy.get(u)) continue;
      dfs2(v, u, false);
    }
    // 处理重儿子：保留桶
    const h = heavy.get(u);
    if (h !== null && h !== undefined) {
      dfs2(h, u, true);
      keepHeavy.add(h);
    }
    // 并入 u 与轻儿子子树
    add(u);
    for (const v of adj.get(u) ?? []) {
      if (v === par || v === heavy.get(u)) continue;
      addSubtree(v, u, null);
    }
    answer.set(u, distinct);
    hooks.onAnswer?.(u, distinct);
    if (h !== null) hooks.onHeavyChild?.(u, h ?? null);

    if (!keep) {
      // 清空整棵 u 子树
      addSubtreeRemove(u, par);
      hooks.onClear?.();
    }
  };

  const addSubtreeRemove = (u: string, par: string | null): void => {
    remove(u);
    for (const v of adj.get(u) ?? []) {
      if (v === par) continue;
      addSubtreeRemove(v, u);
    }
  };

  dfs2(root, null, true);

  return { distinct: answer };
}
