// =============================================================================
// 倍增（Binary Lifting）· 纯算法实现
// 预处理 up[k][v] = v 的第 2^k 个祖先；用「跳 2 的幂」快速回答 LCA（最近公共祖先）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露查询过程供录制器使用。
// =============================================================================

/** 树输入：节点 id 列表 + 父节点 id（根的 parent 为自身或 -1，二者皆被接受）。 */
export interface TreeInput {
  nodes: readonly string[];
  /** parents[i] = nodes[i] 的父节点 id；根的 parent 为自身。 */
  parents: readonly string[];
  /** 根节点 id。 */
  root: string;
}

/** 倍增预处理结果：可重复查询 LCA。 */
export interface BinaryLifting {
  /** up[k][vIdx] = vIdx 的第 2^k 个祖先的下标（不存在则根的下标）。 */
  up: number[][];
  /** depth[vIdx] = 节点深度（根为 0）。 */
  depth: number[];
  /** 最大幂次 K（up 有 K+1 行）。 */
  log: number;
  /** 节点 id → 下标。 */
  indexOf: Map<string, number>;
  nodes: readonly string[];
}

/** LCA 查询过程中的事件钩子。任一可选。 */
export interface LcaHooks {
  /** 把较深的节点上跳 2^k 步（对齐深度阶段）。给出节点下标、跳的步数。 */
  onLift?: (nodeIdx: number, steps: number) => void;
  /** 两节点深度已对齐。给出对齐后的两个节点下标。 */
  onAligned?: (uIdx: number, vIdx: number) => void;
  /** LCA 求得。给出 lca 下标。 */
  onLca?: (lcaIdx: number) => void;
}

/**
 * 预处理倍增表。
 *
 * - up[0][v] = v 的直接父节点（根的 up[0] 指向自身）。
 * - up[k][v] = up[k-1][ up[k-1][v] ]（2^k 步祖先 = 走两次 2^(k-1) 步）。
 * - log = ⌊log2 n⌋，共 log+1 行。
 *
 * 预处理时间 `O(n log n)`，空间 `O(n log n)`。
 */
export function build(input: TreeInput): BinaryLifting {
  const nodes = [...input.nodes];
  const n = nodes.length;
  const indexOf = new Map<string, number>();
  nodes.forEach((id, i) => indexOf.set(id, i));

  // 父节点下标；根（parent==自身 或 parent==-1 或 parent 不存在）指向自身
  const parentIdx = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const p = input.parents[i];
    if (p === undefined || p === input.nodes[i] || p === '') {
      parentIdx[i] = i; // 根
    } else {
      const pi = indexOf.get(p);
      parentIdx[i] = pi !== undefined ? pi : i;
    }
  }

  // 深度（BFS/递推：从根向子节点传播）。先用一次迭代直到稳定。
  const depth = new Array<number>(n).fill(0);
  // 计算 depth：反复直到无变化（树是 DAG，n 轮内必收敛）
  for (let iter = 0; iter < n; iter++) {
    let changed = false;
    for (let i = 0; i < n; i++) {
      const p = parentIdx[i]!;
      if (p !== i) {
        const nd = depth[p]! + 1;
        if (nd > depth[i]!) {
          depth[i] = nd;
          changed = true;
        }
      }
    }
    if (!changed) break;
  }

  const log = n > 1 ? Math.floor(Math.log2(n - 1)) + 1 : 0;
  const up: number[][] = Array.from({ length: log + 1 }, () => new Array<number>(n).fill(0));
  // up[0] = parentIdx
  for (let i = 0; i < n; i++) up[0]![i] = parentIdx[i]!;
  for (let k = 1; k <= log; k++) {
    for (let i = 0; i < n; i++) {
      up[k]![i] = up[k - 1]![up[k - 1]![i]!]!;
    }
  }

  return { up, depth, log, indexOf, nodes };
}

/**
 * 查询 u、v 的最近公共祖先（LCA）。
 *
 * 1. 设 du ≤ dv（否则交换），把 v 上跳 (dv-du) 步对齐深度。
 * 2. 若此时 u==v，则 u 即为 LCA。
 * 3. 否则从大到小尝试 2^k：若 up[k][u] != up[k][v] 则同时上跳 2^k（保持二者不同）。
 * 4. 最后 u、v 的父节点 up[0][u] 即为 LCA。
 *
 * 单次查询 `O(log n)`。
 */
export function lca(bl: BinaryLifting, u: string, v: string, hooks: LcaHooks = {}): string | null {
  const { up, depth, log, indexOf, nodes } = bl;
  if (!indexOf.has(u) || !indexOf.has(v)) return null;
  let ui = indexOf.get(u)!;
  let vi = indexOf.get(v)!;

  // 1. 对齐深度：让 vi 是较深者
  if (depth[ui]! > depth[vi]!) {
    const t = ui;
    ui = vi;
    vi = t;
  }
  const diff = depth[vi]! - depth[ui]!;
  // 把 vi 上跳 diff 步
  for (let k = log; k >= 0; k--) {
    if ((diff >> k) & 1) {
      hooks.onLift?.(vi, 1 << k);
      vi = up[k]![vi]!;
    }
  }
  hooks.onAligned?.(ui, vi);

  // 2. 对齐后若相同
  if (ui === vi) {
    hooks.onLca?.(ui);
    return nodes[ui]!;
  }

  // 3. 从大到小跳，保持不同
  for (let k = log; k >= 0; k--) {
    if (up[k]![ui]! !== up[k]![vi]!) {
      hooks.onLift?.(ui, 1 << k);
      hooks.onLift?.(vi, 1 << k);
      ui = up[k]![ui]!;
      vi = up[k]![vi]!;
    }
  }
  // 4. 父节点即 LCA
  hooks.onLca?.(up[0]![ui]!);
  return nodes[up[0]![ui]!]!;
}

/** 便捷：一次调用完成预处理 + 单次 LCA 查询。 */
export function binaryLifting(input: TreeInput, u: string, v: string): string | null {
  return lca(build(input), u, v);
}
