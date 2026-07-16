// =============================================================================
// RMQ 求 LCA（Euler Tour + Sparse Table）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：对树做欧拉游迹（每条边进出都记录），得到长度 2n-1 的序列 euler[]，
//       每点对应深度 depth[]。u、v 的 LCA = euler 区间 [first[u], first[v]]
//       内深度最小者的节点。用稀疏表 O(1) 回答。
// =============================================================================

/** 树输入（无向边构成一棵树，指定根）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface RmqLcaHooks {
  /** 欧拉游迹访问节点 u（seqIdx 为在 euler[] 中的位置）。 */
  onEuler?: (u: string, seqIdx: number) => void;
  /** 构建稀疏表完成。 */
  onSparseBuilt?: (levels: number) => void;
  /** 回答询问 (u,v) 的 LCA。 */
  onAnswer?: (u: string, v: string, lca: string) => void;
}

export interface RmqLcaResult {
  /** 回答函数：lca(u, v)。 */
  query: (u: string, v: string) => string;
  /** 欧拉序列。 */
  euler: string[];
}

/**
 * RMQ-LCA 预处理 + 在线查询。
 *
 * @param tree 树
 * @param hooks 可选事件钩子
 * @returns 含 query 函数与 euler 序列
 */
export function rmqLca(input: GraphInput, hooks: RmqLcaHooks = {}): RmqLcaResult {
  const { nodes, edges, root } = input;

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
    if (adj.has(e.to)) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const euler: string[] = [];
  const depthAt: number[] = []; // 每个 euler 位置的深度
  const first = new Map<string, number>(); // 节点首次出现位置

  const dfs = (u: string, par: string | null, d: number): void => {
    first.set(u, euler.length);
    euler.push(u);
    depthAt.push(d);
    hooks.onEuler?.(u, euler.length - 1);
    for (const v of adj.get(u) ?? []) {
      if (v === par) continue;
      dfs(v, u, d + 1);
      // 回到 u
      euler.push(u);
      depthAt.push(d);
      hooks.onEuler?.(u, euler.length - 1);
    }
  };
  if (nodes.includes(root)) dfs(root, null, 0);

  // 稀疏表：st[k][i] = 区间 [i, i+2^k-1] 中深度最小的位置
  const n = euler.length;
  const LOG = Math.max(1, Math.floor(Math.log2(Math.max(1, n))) + 1);
  const st: number[][] = [];
  for (let k = 0; k <= LOG; k++) st.push(new Array(n).fill(0));
  for (let i = 0; i < n; i++) st[0]![i] = i;
  for (let k = 1; k <= LOG; k++) {
    for (let i = 0; i + (1 << k) - 1 < n; i++) {
      const a = st[k - 1]![i]!;
      const b = st[k - 1]![i + (1 << (k - 1))]!;
      st[k]![i] = depthAt[a]! <= depthAt[b]! ? a : b;
    }
  }
  hooks.onSparseBuilt?.(LOG);

  // 预处理 log2
  const log2: number[] = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) log2[i] = log2[i >> 1]! + 1;

  const query = (u: string, v: string): string => {
    if (!first.has(u) || !first.has(v)) return '';
    let l = first.get(u)!;
    let r = first.get(v)!;
    if (l > r) [l, r] = [r, l];
    const k = log2[r - l + 1]!;
    const a = st[k]![l]!;
    const b = st[k]![r - (1 << k) + 1]!;
    const pos = depthAt[a]! <= depthAt[b]! ? a : b;
    const res = euler[pos]!;
    hooks.onAnswer?.(u, v, res);
    return res;
  };

  return { query, euler };
}
