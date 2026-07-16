// =============================================================================
// 树哈希（Tree Hash）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 有根树哈希：对每个节点，将其子节点哈希排序后用 AHU 序列编码：
//   hash(u) = f( sort(hash(child)) ) ，叶子为 f(empty)。
// 选用大质数取模的多项式滚动，同构有根树哈希相等。
// =============================================================================

/** 树输入（无向边构成一棵树，指定根）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface TreeHashHooks {
  /** 后序访问 u，得到其哈希值。 */
  onVisit?: (u: string, hash: bigint, parent: string | null) => void;
  /** 子节点哈希排序后得到的有序列表。 */
  onCombine?: (u: string, childHashes: bigint[]) => void;
  /** 全树哈希完成。 */
  onRoot?: (root: string, hash: bigint) => void;
}

export interface TreeHashResult {
  /** 根的哈希值（代表整棵树）。 */
  rootHash: bigint;
  /** 每节点哈希。 */
  hash: Map<string, bigint>;
}

// 多项式滚动常数（大质数）
const BASE = 131n;
const MOD = (1n << 61n) - 1n;

const mulMod = (a: bigint, b: bigint): bigint => (a * b) % MOD;
const addMod = (a: bigint, b: bigint): bigint => (a + b) % MOD;

/** 叶子节点的种子。 */
const LEAF = 3n;

/**
 * 把有序子哈希列表编码为单个哈希：括号序的滚动多项式。
 * hash = ( LEAF + Σ (BASE^i * child[i]) ) 模 MOD，再加结尾哨兵。
 */
function encode(childHashes: bigint[]): bigint {
  let h = LEAF;
  for (const c of childHashes) {
    h = addMod(mulMod(h, BASE), c);
  }
  // 结尾哨兵：再加一次 BASE 以区分 [a] 与 [a,a] 等情形
  h = addMod(mulMod(h, BASE), LEAF);
  return h;
}

/**
 * 有根树哈希。
 *
 * @param input 树（含根）
 * @param hooks 可选事件钩子
 * @returns 根哈希 + 每节点哈希
 */
export function treeHash(input: GraphInput, hooks: TreeHashHooks = {}): TreeHashResult {
  const { nodes, edges, root } = input;
  const hash = new Map<string, bigint>();
  if (nodes.length === 0) return { rootHash: 0n, hash };

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const dfs = (u: string, parent: string | null): bigint => {
    const childHashes: bigint[] = [];
    for (const v of adj.get(u) ?? []) {
      if (v === parent) continue;
      childHashes.push(dfs(v, u));
    }
    childHashes.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    hooks.onCombine?.(u, childHashes);
    const h = encode(childHashes);
    hash.set(u, h);
    hooks.onVisit?.(u, h, parent);
    return h;
  };

  const rootHash = dfs(root, null);
  hooks.onRoot?.(root, rootHash);

  return { rootHash, hash };
}
