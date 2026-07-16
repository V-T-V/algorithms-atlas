// =============================================================================
// 欧拉回路存在性判定（数学）· 纯算法实现
// 不构造回路，仅判定存在性：
//   无向图：连通（忽略孤立点）且所有非孤立点度数为偶数。
//   有向图：弱连通且每点入度==出度。
// 与 euler-circuit（构造算法）区分：这里只返回判定结论与判据。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  undirected?: boolean;
}

export interface EulerExistHooks {
  onCheck?: (criterion: string, ok: boolean) => void;
  onResult?: (exists: boolean, reason: string | null) => void;
}

export interface EulerExistResult {
  exists: boolean;
  reason: string | null;
}

export function eulerCircuitExists(
  input: GraphInput,
  hooks: EulerExistHooks = {},
): EulerExistResult {
  const undirected = input.undirected ?? true;
  const { nodes, edges } = input;

  const adj = new Map<string, Set<string>>();
  for (const n of nodes) adj.set(n, new Set());
  for (const e of edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.add(e.to);
    if (undirected) adj.get(e.to)!.add(e.from);
  }

  // 找一个非孤立点作为连通性起点
  let start: string | null = null;
  for (const n of nodes) {
    if ((adj.get(n)?.size ?? 0) > 0) {
      start = n;
      break;
    }
  }
  if (start === null) {
    // 没有边：约定存在（平凡空回路）
    hooks.onResult?.(true, '无边图（平凡情形）');
    return { exists: true, reason: '无边图（平凡情形）' };
  }

  // —— 连通性（在「非孤立」点子图上）——
  const reachable = new Set<string>([start]);
  const stack: string[] = [start];
  while (stack.length > 0) {
    const u = stack.pop()!;
    for (const v of adj.get(u) ?? []) {
      if (!reachable.has(v)) {
        reachable.add(v);
        stack.push(v);
      }
    }
  }
  const connected = nodes.every((n) => (adj.get(n)?.size ?? 0) === 0 || reachable.has(n));
  hooks.onCheck?.('非孤立点连通', connected);

  if (!connected) {
    hooks.onResult?.(false, '有边的子图不连通');
    return { exists: false, reason: '有边的子图不连通' };
  }

  // —— 度数条件 ——
  if (undirected) {
    for (const n of nodes) {
      const d = adj.get(n)?.size ?? 0;
      if (d > 0 && (d & 1) === 1) {
        hooks.onCheck?.(`度(${n})=${d} 为奇`, false);
        hooks.onResult?.(false, `${n} 度数为奇`);
        return { exists: false, reason: `${n} 度数为奇` };
      }
    }
    hooks.onCheck?.('所有度数为偶', true);
  } else {
    const outDeg = new Map<string, number>();
    const inDeg = new Map<string, number>();
    for (const n of nodes) {
      outDeg.set(n, 0);
      inDeg.set(n, 0);
    }
    for (const e of edges) {
      if (!outDeg.has(e.from) || !inDeg.has(e.to)) continue;
      outDeg.set(e.from, (outDeg.get(e.from) ?? 0) + 1);
      inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    }
    for (const n of nodes) {
      if (outDeg.get(n) !== inDeg.get(n)) {
        hooks.onCheck?.(`入度≠出度(${n})`, false);
        hooks.onResult?.(false, `${n} 入度≠出度`);
        return { exists: false, reason: `${n} 入度≠出度` };
      }
    }
    hooks.onCheck?.('入度=出度', true);
  }

  hooks.onResult?.(true, null);
  return { exists: true, reason: null };
}
