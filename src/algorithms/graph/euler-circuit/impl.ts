// =============================================================================
// 欧拉回路（Eulerian Circuit）· 纯算法实现
// Hierholzer 算法：从一个存在度>0 的节点出发，沿未用边走成一条「游走」，
//   走到死胡同就回退并入栈；遇到还有未用边的内部点，再开一条子游走并拼入。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  /** true=无向（默认）；false=有向。 */
  undirected?: boolean;
}

export interface EulerHooks {
  onAdvance?: (u: string, v: string, edgeIdx: number) => void;
  onBacktrack?: (v: string) => void;
  onResult?: (circuit: string[] | null) => void;
}

export interface EulerResult {
  circuit: string[] | null;
  /** 不满足欧拉回路条件的原因，null 表示存在。 */
  reason: string | null;
}

/** 判定并求欧拉回路。 */
export function eulerCircuit(input: GraphInput, hooks: EulerHooks = {}): EulerResult {
  const undirected = input.undirected ?? true;
  const { nodes } = input;

  // 构建邻接表（带边 id）；为支持删除，用「当前指针」法
  const adj = new Map<string, Array<{ to: string; idx: number }>>();
  const degree = new Map<string, number>();
  for (const n of nodes) {
    adj.set(n, []);
    degree.set(n, 0);
  }
  input.edges.forEach((e, idx) => {
    if (!adj.has(e.from) || !adj.has(e.to)) return;
    adj.get(e.from)!.push({ to: e.to, idx });
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    if (undirected) {
      adj.get(e.to)!.push({ to: e.from, idx });
      degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
    } else {
      // 有向：入度差
    }
  });

  const used = new Set<number>();

  // —— 存在性判定 ——
  // 1) 所有有边的点必须连通（在用边子图上）
  // 2) 无向：所有度数为偶数；有向：入度==出度
  let startNode: string | null = null;
  for (const n of nodes) {
    if ((degree.get(n) ?? 0) > 0) {
      startNode = n;
      break;
    }
  }
  if (startNode === null) {
    hooks.onResult?.([]);
    return { circuit: [], reason: null };
  }

  if (undirected) {
    for (const n of nodes) {
      if (((degree.get(n) ?? 0) & 1) === 1) {
        hooks.onResult?.(null);
        return { circuit: null, reason: `${n} 度数为奇数，存在欧拉路径而非回路` };
      }
    }
  } else {
    const outDeg = new Map<string, number>();
    const inDeg = new Map<string, number>();
    for (const n of nodes) {
      outDeg.set(n, 0);
      inDeg.set(n, 0);
    }
    for (const e of input.edges) {
      if (!outDeg.has(e.from) || !inDeg.has(e.to)) continue;
      outDeg.set(e.from, (outDeg.get(e.from) ?? 0) + 1);
      inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    }
    for (const n of nodes) {
      if (outDeg.get(n) !== inDeg.get(n)) {
        hooks.onResult?.(null);
        return { circuit: null, reason: `${n} 入度≠出度` };
      }
    }
  }

  // 连通性：在用边子图上 BFS
  const visited = new Set<string>([startNode]);
  const q: string[] = [startNode];
  while (q.length > 0) {
    const u = q.shift()!;
    for (const { to, idx } of adj.get(u) ?? []) {
      if (used.has(idx)) continue;
      // 此处 used 还未消费，用「边存在性」判连通：临时用一次
      void idx;
      if (!visited.has(to)) {
        visited.add(to);
        q.push(to);
      }
    }
  }
  // 检查：每个度数>0 的点都被访问
  // 注意：上面 used 还未消费，所以连通性 OK——再补一次保证有边但不可达
  // （ Hierholzer 流程本身会自洽，这里仅作为前置校验）

  // —— Hierholzer（迭代）——
  // cur[i] 记录节点 i 的邻接游标
  const ptr = new Map<string, number>();
  for (const n of nodes) ptr.set(n, 0);
  const stack: string[] = [startNode];
  const circuit: string[] = [];

  // 用「跳过已用边」的方式前进
  const nextEdge = (u: string): { to: string; idx: number } | null => {
    const list = adj.get(u) ?? [];
    let p = ptr.get(u) ?? 0;
    while (p < list.length && used.has(list[p]!.idx)) p++;
    ptr.set(u, p);
    return p < list.length ? list[p]! : null;
  };

  while (stack.length > 0) {
    const u = stack[stack.length - 1]!;
    const e = nextEdge(u);
    if (e) {
      used.add(e.idx);
      ptr.set(u, (ptr.get(u) ?? 0) + 1);
      hooks.onAdvance?.(u, e.to, e.idx);
      stack.push(e.to);
    } else {
      stack.pop();
      circuit.push(u);
      hooks.onBacktrack?.(u);
    }
  }

  circuit.reverse();
  // 检查是否用完所有边
  if (circuit.length - 1 !== input.edges.length) {
    hooks.onResult?.(null);
    return { circuit: null, reason: '图不连通，无法形成回路' };
  }

  hooks.onResult?.(circuit);
  return { circuit, reason: null };
}
