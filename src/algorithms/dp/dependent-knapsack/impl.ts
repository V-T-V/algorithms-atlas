// =============================================================================
// 依赖背包 Dependent Knapsack（树形/主从背包）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 物品存在树形依赖：选某物品必须先选其父。转化为树形 DP（子树合并）。
// =============================================================================

/** 一个物品：重量、价值、依赖的父节点下标（-1 表示根/虚拟节点）。 */
export interface DepItem {
  weight: number;
  value: number;
  /** 父节点下标（0-based）；-1 表示无依赖（直接挂在虚拟根下）。 */
  parent: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface DependentKnapsackHooks {
  /** 进入节点 u 的子树处理。 */
  onEnter?: (u: number) => void;
  /** 把子节点 c 的 dp 合并进父节点 u：在容量 w 处更新为 val。 */
  onMerge?: (u: number, c: number, w: number, val: number) => void;
  /** 节点 u 的子树处理完毕。 */
  onLeave?: (u: number) => void;
  /** 算法完成：最大价值。 */
  onDone?: (value: number) => void;
}

/**
 * 依赖（树形）背包：物品存在森林/树形依赖，选 `i` 必须先选 `parent[i]`。
 * 求容量 `W` 下的最大价值。
 *
 * 树形 DP：以「虚拟根 0」串联所有 `parent == -1` 的物品（视为必须占容 0、价值 0 的入口）。
 *   - 后序 DFS，对节点 `u` 维护 `f[w]` = 在 `u` 子树内、占用容量 `w`（含 `u` 自身）的最大价值
 *   - 先放 `u` 自身（`f[weight] = value`，其余 -∞）
 *   - 依次合并每个子 `c`：`f[w] = max(f[w], f[w - g] + g_c[g])`（g 遍历子 c 的容量）
 * - 根的 `f[W]` 即答案（虚拟根占 0 容）
 *
 * **泛化物品合并**：复杂度 `O(n·W)`（合并两子树时按「剩余容量」枚举，整体退化为树上背包经典界）。
 *
 * @param items 物品列表（parent 指向同数组下标或 -1）
 * @param capacity 容量
 * @returns 最大价值
 */
export function dependentKnapsack(
  items: readonly DepItem[],
  capacity: number,
  hooks: DependentKnapsackHooks = {},
): number {
  const n = items.length;
  if (n === 0 || capacity <= 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const NEG = -Infinity;
  // 孩子 adjacency：外加虚拟根（下标 n）
  const children: number[][] = Array.from({ length: n + 1 }, () => []);
  for (let i = 0; i < n; i++) {
    const p = items[i]!.parent;
    children[p === -1 ? n : p]!.push(i);
  }
  // 虚拟根物品：占 0 容、价值 0
  const weightOf = (u: number): number => (u === n ? 0 : items[u]!.weight);
  const valueOf = (u: number): number => (u === n ? 0 : items[u]!.value);

  // f[u][w]：u 子树内、占用 w、含 u 的最大价值
  const f: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(capacity + 1).fill(NEG),
  );

  const dfs = (u: number): void => {
    hooks.onEnter?.(u);
    const w0 = weightOf(u);
    // 必须选 u（虚拟根除外也照此初始化：选 u 至少占 w0）
    if (w0 <= capacity) f[u]![w0] = valueOf(u);

    for (const c of children[u]!) {
      dfs(c);
      // 合并 c：倒序枚举 u 占用 w，正/倒枚举 g（c 占用）
      const fu = [...f[u]!];
      for (let w = capacity; w >= 0; w--) {
        if (f[u]![w]! === NEG) continue;
        for (let g = 0; g + w <= capacity; g++) {
          if (f[c]![g]! === NEG) continue;
          const cand = f[u]![w]! + f[c]![g]!;
          if (cand > fu[w + g]!) {
            fu[w + g] = cand;
            hooks.onMerge?.(u, c, w + g, cand);
          }
        }
      }
      f[u] = fu;
    }
    hooks.onLeave?.(u);
  };

  dfs(n); // 从虚拟根开始

  let best = 0;
  for (let w = 0; w <= capacity; w++) best = Math.max(best, f[n]![w]!);
  hooks.onDone?.(best);
  return best;
}
