// =============================================================================
// Prüfer 编码（Prufer Code）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// Prüfer 编码：n 个标号节点（1..n）的树 ↔ 长度 n-2 的序列的双射。
// 编码：每次删去编号最小的叶子，记录其邻居，重复 n-2 次。
// 解码：由序列 + 度数贪心重建树。
// =============================================================================

/** 树输入：节点为 1..n 的整数标号，无向边。 */
export interface GraphInput {
  /** 节点数 n（节点标号 1..n）。 */
  n: number;
  edges: ReadonlyArray<{ from: number; to: number }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface PruferHooks {
  /** 删除叶子 leaf，记录其邻居 neighbor。 */
  onDeleteLeaf?: (leaf: number, neighbor: number, step: number) => void;
  /** 编码完成，得到序列。 */
  onCode?: (code: number[]) => void;
  /** 解码：连接 u 与当前最小叶子 v。 */
  onDecodeEdge?: (u: number, v: number, step: number) => void;
}

export interface PruferResult {
  /** Prüfer 序列（长度 n-2，n≥2）。 */
  code: number[];
}

/**
 * 由树（1..n 标号）生成 Prüfer 编码。
 *
 * @param input 树
 * @param hooks 可选事件钩子
 * @returns Prüfer 序列
 */
export function prufer(input: GraphInput, hooks: PruferHooks = {}): PruferResult {
  const { n, edges } = input;
  if (n <= 1) return { code: [] };

  const degree = new Array<number>(n + 1).fill(0);
  const adj = new Map<number, Set<number>>();
  for (let i = 1; i <= n; i++) adj.set(i, new Set());
  for (const e of edges) {
    degree[e.from] = (degree[e.from] ?? 0) + 1;
    degree[e.to] = (degree[e.to] ?? 0) + 1;
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
  }

  // 用最小堆找最小叶子；n 不大时可用优先队列
  const leafPQ: number[] = [];
  for (let i = 1; i <= n; i++) if ((degree[i] ?? 0) === 1) leafPQ.push(i);
  // 保持最小：用排序插入
  leafPQ.sort((a, b) => a - b);

  const code: number[] = [];
  let step = 0;
  // 删除 n-2 次（n=2 时删 0 次即得空序列）
  for (let iter = 0; iter < n - 2; iter++) {
    // 取最小叶子
    let leaf = leafPQ.shift()!;
    // 若该叶子已被删过或度数不对，跳过（队列中可能有陈旧值）
    while (leafPQ.length > 0 && (degree[leaf] ?? 0) !== 1) leaf = leafPQ.shift()!;
    if ((degree[leaf] ?? 0) !== 1) break;

    const neighbors = adj.get(leaf);
    let neighbor = -1;
    if (neighbors) {
      for (const nb of neighbors) {
        if ((degree[nb] ?? 0) > 0) {
          neighbor = nb;
          break;
        }
      }
    }
    code.push(neighbor);
    degree[leaf] = (degree[leaf] ?? 0) - 1;
    degree[neighbor] = (degree[neighbor] ?? 0) - 1;
    adj.get(leaf)?.delete(neighbor);
    adj.get(neighbor)?.delete(leaf);
    step++;
    hooks.onDeleteLeaf?.(leaf, neighbor, step);
    if ((degree[neighbor] ?? 0) === 1) {
      // 插入并保持有序
      insertSorted(leafPQ, neighbor);
    }
  }

  hooks.onCode?.(code);
  return { code };
}

function insertSorted(arr: number[], v: number): void {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((arr[mid] ?? 0) < v) lo = mid + 1;
    else hi = mid;
  }
  arr.splice(lo, 0, v);
}

/**
 * 由 Prüfer 序列解码为树。
 *
 * @param code Prüfer 序列（长度 n-2，节点 1..n，n = code.length + 2）
 * @param hooks 可选事件钩子
 * @returns 重建的边集
 */
export function pruferDecode(
  code: number[],
  hooks: PruferHooks = {},
): Array<{ from: number; to: number }> {
  const m = code.length;
  const n = m + 2;
  const degree = new Array<number>(n + 1).fill(1);
  for (const c of code) degree[c] = (degree[c] ?? 0) + 1;

  const leafPQ: number[] = [];
  for (let i = 1; i <= n; i++) if ((degree[i] ?? 0) === 1) leafPQ.push(i);

  const treeEdges: Array<{ from: number; to: number }> = [];
  let step = 0;
  for (const c of code) {
    let leaf = leafPQ.shift()!;
    while (leafPQ.length > 0 && (degree[leaf] ?? 0) !== 1) leaf = leafPQ.shift()!;
    if ((degree[leaf] ?? 0) !== 1) break;
    step++;
    treeEdges.push({ from: leaf, to: c });
    hooks.onDecodeEdge?.(leaf, c, step);
    degree[leaf] = (degree[leaf] ?? 0) - 1;
    degree[c] = (degree[c] ?? 0) - 1;
    if ((degree[c] ?? 0) === 1) insertSorted(leafPQ, c);
  }
  // 最后连剩下的两个度为 1 的节点
  const remain: number[] = [];
  for (let i = 1; i <= n; i++) if ((degree[i] ?? 0) === 1) remain.push(i);
  if (remain.length === 2) {
    step++;
    treeEdges.push({ from: remain[0]!, to: remain[1]! });
    hooks.onDecodeEdge?.(remain[0]!, remain[1]!, step);
  }
  return treeEdges;
}
