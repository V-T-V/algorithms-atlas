// =============================================================================
// 点分治（Centroid Decomposition）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 反复选取当前子树的「重心」（删除后最大子树最小的节点）作为分治中心，
// 递归处理各子树，得到一棵高度 O(log n) 的「点分树」。
// =============================================================================

/** 树输入（无向边构成一棵树，可指定根用于首发）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface CentroidDecompHooks {
  /** 进入一个分治层：subtreeRoot 为当前处理的连通块入口，block 为该块全部节点。 */
  onBlock?: (subtreeRoot: string, block: string[]) => void;
  /** 找到该块的重心 c，maxSub 为删 c 后最大子树大小。 */
  onCentroid?: (c: string, maxSub: number) => void;
  /** 在点分树中把 child 连到父 par。 */
  onTreeEdge?: (par: string, child: string) => void;
  /** 算法完成：分治层数。 */
  onDone?: (levels: number) => void;
}

export interface CentroidDecompResult {
  /** 点分树：每个节点的父（重心树的父）。根重心父为 null。 */
  centroidParent: Map<string, string | null>;
  /** 点分树：每个节点的孩子。 */
  centroidChildren: Map<string, string[]>;
  /** 全局根重心。 */
  root: string;
}

/**
 * 点分治（重心分解）。
 *
 * @param input 树
 * @param hooks 可选事件钩子
 * @returns 点分树（重心树）
 */
export function centroidDecomp(
  input: GraphInput,
  hooks: CentroidDecompHooks = {},
): CentroidDecompResult {
  const { nodes, edges } = input;

  const adj = new Map<string, Set<string>>();
  for (const n of nodes) adj.set(n, new Set());
  for (const e of edges) {
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
  }

  const removed = new Set<string>();
  const centroidParent = new Map<string, string | null>();
  const centroidChildren = new Map<string, string[]>();
  for (const n of nodes) centroidChildren.set(n, []);
  let levels = 0;
  let globalRoot: string | null = null;

  // 求连通块（从 start 出发，跳过 removed）的全部节点与各点子树大小
  const collectBlock = (start: string): string[] => {
    const block: string[] = [];
    const stack = [start];
    const seen = new Set<string>([start]);
    while (stack.length > 0) {
      const u = stack.pop()!;
      block.push(u);
      for (const v of adj.get(u) ?? []) {
        if (!seen.has(v) && !removed.has(v)) {
          seen.add(v);
          stack.push(v);
        }
      }
    }
    return block;
  };

  // 求该块的重心
  const findCentroid = (start: string): { c: string; block: string[] } => {
    const block = collectBlock(start);
    const blockSet = new Set(block);
    const size = new Map<string, number>();
    const total = block.length;

    const calcSize = (u: string, par: string | null): number => {
      let s = 1;
      for (const v of adj.get(u) ?? []) {
        if (v === par || removed.has(v) || !blockSet.has(v)) continue;
        s += calcSize(v, u);
      }
      size.set(u, s);
      return s;
    };
    calcSize(start, null);

    let centroid = start;
    let par: string | null = null;
    let moved = true;
    while (moved) {
      moved = false;
      for (const v of adj.get(centroid) ?? []) {
        if (v === par || removed.has(v) || !blockSet.has(v)) continue;
        if ((size.get(v) ?? 0) > total / 2) {
          par = centroid;
          centroid = v;
          moved = true;
          break;
        }
      }
    }
    // 计算 maxSub
    let maxSub = 0;
    for (const v of adj.get(centroid) ?? []) {
      if (removed.has(v) || !blockSet.has(v)) continue;
      if (v === par) maxSub = Math.max(maxSub, total - (size.get(centroid) ?? 1));
      else maxSub = Math.max(maxSub, size.get(v) ?? 0);
    }
    hooks.onCentroid?.(centroid, maxSub);
    return { c: centroid, block };
  };

  const decompose = (start: string, cParent: string | null): void => {
    levels++;
    const { c, block } = findCentroid(start);
    hooks.onBlock?.(start, block);
    removed.add(c);
    centroidParent.set(c, cParent);
    if (cParent !== null) {
      centroidChildren.get(cParent)!.push(c);
      hooks.onTreeEdge?.(cParent, c);
    } else {
      globalRoot = c;
    }
    // 递归各剩余连通块
    for (const v of adj.get(c) ?? []) {
      if (!removed.has(v)) decompose(v, c);
    }
  };

  if (nodes.includes(input.root)) decompose(input.root, null);

  hooks.onDone?.(levels);
  return {
    centroidParent,
    centroidChildren,
    root: globalRoot ?? input.root,
  };
}
