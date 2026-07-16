// =============================================================================
// 欧拉路径 / 欧拉回路 · 纯算法实现（Hierholzer 算法）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 求经过每条边恰好一次的路径（或回路）。支持无向图与有向图。
// =============================================================================

/** 图输入。无向图请把每条无向边拆成一对有向边记录，或在调用前手动对称加入。 */
export interface EulerGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  /** 是否有向。默认无向。 */
  directed?: boolean;
}

/** Hierholzer 执行过程中的事件钩子。任一可选。 */
export interface EulerHooks {
  /** 从某节点开始深入探索（入栈）。 */
  onEnter?: (node: string) => void;
  /** 沿边 (u,v) 推进（u→v）。 */
  onTraverse?: (u: string, v: string) => void;
  /** 节点已无可用边，回溯（出栈，加入路径）。 */
  onBacktrack?: (node: string, pathLen: number) => void;
  /** 算法完成：路径序列；isCircuit 表示是否为欧拉回路（首尾相同）。 */
  onDone?: (path: string[], isCircuit: boolean) => void;
}

/** 欧拉结果。 */
export interface EulerResult {
  /** 路径节点序列。失败（无欧拉路）返回 null。 */
  path: string[] | null;
  /** 是否为欧拉回路。 */
  isCircuit: boolean;
}

/** 计算每个节点的度（无向：度数；有向：出度-入度），用于判定起点与存在性。 */
function degreeInfo(input: EulerGraphInput): {
  outDeg: Map<string, number>;
  inDeg: Map<string, number>;
} {
  const outDeg = new Map<string, number>();
  const inDeg = new Map<string, number>();
  for (const n of input.nodes) {
    outDeg.set(n, 0);
    inDeg.set(n, 0);
  }
  for (const e of input.edges) {
    outDeg.set(e.from, (outDeg.get(e.from) ?? 0) + 1);
    inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    if (!input.directed) {
      outDeg.set(e.to, (outDeg.get(e.to) ?? 0) + 1);
      inDeg.set(e.from, (inDeg.get(e.from) ?? 0) + 1);
    }
  }
  return { outDeg, inDeg };
}

/**
 * Hierholzer 算法求欧拉路径 / 欧拉回路。
 *
 * @param input 图
 * @param hooks 可选事件钩子
 * @returns 欧拉路径（或回路）的节点序列；不存在则 path=null
 */
export function eulerPath(input: EulerGraphInput, hooks: EulerHooks = {}): EulerResult {
  const { nodes, edges, directed = false } = input;

  // —— 1. 判定起点 ——
  const { outDeg, inDeg } = degreeInfo(input);
  let start: string | null = null;
  let isCircuit = true;

  if (directed) {
    let posStart: string | null = null;
    let negStart: string | null = null;
    let ok = true;
    for (const n of nodes) {
      const o = outDeg.get(n) ?? 0;
      const i = inDeg.get(n) ?? 0;
      const diff = o - i;
      if (diff === 1) {
        if (posStart !== null) {
          ok = false;
          break;
        }
        posStart = n;
      } else if (diff === -1) {
        if (negStart !== null) {
          ok = false;
          break;
        }
        negStart = n;
      } else if (diff !== 0) {
        ok = false;
        break;
      }
    }
    if (!ok || Boolean(posStart) !== Boolean(negStart)) {
      hooks.onDone?.([], false);
      return { path: null, isCircuit: false };
    }
    if (posStart) {
      start = posStart;
      isCircuit = false;
    }
  } else {
    const odd: string[] = [];
    for (const n of nodes) {
      const d = outDeg.get(n) ?? 0;
      if (d % 2 === 1) odd.push(n);
    }
    if (odd.length !== 0 && odd.length !== 2) {
      hooks.onDone?.([], false);
      return { path: null, isCircuit: false };
    }
    if (odd.length === 2) {
      odd.sort();
      start = odd[0]!;
      isCircuit = false;
    }
  }
  // 回路：任取有出边的节点
  if (start === null) {
    for (const n of nodes) {
      if ((outDeg.get(n) ?? 0) > 0) {
        start = n;
        break;
      }
    }
  }
  if (start === null) {
    // 空图：单点回路
    start = nodes[0] ?? '';
    hooks.onDone?.([start], true);
    return { path: [start], isCircuit: true };
  }

  // —— 2. 建邻接表（用「下一条可用边」指针，配合标记删除）——
  // 无向图：每条边拆成两条有向边，互为反边；走一条则两条同标记。
  const adj = new Map<string, Array<{ to: string; used: boolean; pair?: [number, number] }>>();
  for (const n of nodes) adj.set(n, []);
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i]!;
    const fwdIdx = adj.get(e.from)!.length;
    adj.get(e.from)!.push({ to: e.to, used: false });
    if (directed) {
      // 反边仅占位（不参与无向成对删除）
    } else {
      const revIdx = adj.get(e.to)!.length;
      adj.get(e.to)!.push({ to: e.from, used: false });
      // 互记配对
      adj.get(e.from)![fwdIdx]!.pair = [i, revIdx];
      adj.get(e.to)![revIdx]!.pair = [i, fwdIdx];
    }
  }
  // 无向邻接按目标字典序排序（保持确定顺序）；需重算 pair 的 rev 索引
  if (!directed) {
    for (const [, list] of adj) {
      list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));
    }
    // 排序后重新建立 pair：找原始无向边索引相同的两条边配对
    const byOrigEdge = new Map<number, Array<{ node: string; idx: number }>>();
    for (const [u, list] of adj) {
      list.forEach((item, idx) => {
        if (item.pair) {
          const orig = item.pair[0];
          if (!byOrigEdge.has(orig)) byOrigEdge.set(orig, []);
          byOrigEdge.get(orig)!.push({ node: u, idx });
          item.pair = undefined;
        }
      });
    }
    for (const group of byOrigEdge.values()) {
      if (group.length === 2) {
        const a = group[0]!;
        const b = group[1]!;
        adj.get(a.node)![a.idx]!.pair = [-1, b.idx];
        adj.get(b.node)![b.idx]!.pair = [-1, a.idx];
      }
    }
  } else {
    // 有向：按 to 排序
    for (const list of adj.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));
  }

  // —— 3. Hierholzer 迭代（栈）——
  const stack: string[] = [start];
  const path: string[] = [];
  // 每个节点下一个待考察的下标
  const ptr = new Map<string, number>();
  for (const n of nodes) ptr.set(n, 0);
  // 记录已遍历的有向边序号（用于 trace 高亮）— 这里简化：用 used 标记
  hooks.onEnter?.(start);

  while (stack.length > 0) {
    const u = stack[stack.length - 1]!;
    const list = adj.get(u)!;
    let i = ptr.get(u)!;
    while (i < list.length && list[i]!.used) i++;
    if (i < list.length) {
      const edge = list[i]!;
      const v = edge.to;
      edge.used = true;
      // 无向：把反边也标记
      if (!directed && edge.pair) {
        const revIdx = edge.pair[1];
        const revNode = v;
        adj.get(revNode)![revIdx]!.used = true;
      }
      ptr.set(u, i + 1);
      hooks.onTraverse?.(u, v);
      stack.push(v);
      hooks.onEnter?.(v);
    } else {
      // u 无可用边，回溯
      stack.pop();
      path.push(u);
      hooks.onBacktrack?.(u, path.length);
    }
  }

  path.reverse();
  // 校验是否真的用完所有边（连通性）
  const totalEdges = directed ? edges.length : edges.length;
  const usedCount = countUsed(adj, directed);
  if (usedCount !== totalEdges) {
    hooks.onDone?.([], false);
    return { path: null, isCircuit: false };
  }

  hooks.onDone?.(path, isCircuit);
  return { path, isCircuit };
}

/** 统计已用边数（有向：正边 used；无向：成对 used 取一半）。 */
function countUsed(
  adj: Map<string, Array<{ to: string; used: boolean; pair?: [number, number] }>>,
  directed: boolean,
): number {
  let n = 0;
  for (const [, list] of adj) {
    for (const e of list) if (e.used) n++;
  }
  return directed ? n : n / 2;
}
