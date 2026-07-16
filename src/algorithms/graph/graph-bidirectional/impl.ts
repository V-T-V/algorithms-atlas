// =============================================================================
// 双向 BFS · 纯算法实现
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  directed?: boolean;
}

export interface BiBfsHooks {
  onExpand?: (side: 'src' | 'tgt', node: string) => void;
  onMeet?: (mu: string, dist: number) => void;
  onDone?: (found: boolean, dist: number) => void;
}

export interface BiBfsResult {
  found: boolean;
  dist: number;
}

export function bidirectionalBfs(
  input: GraphInput,
  source: string,
  target: string,
  hooks: BiBfsHooks = {},
): BiBfsResult {
  if (source === target) {
    hooks.onDone?.(true, 0);
    return { found: true, dist: 0 };
  }
  const adj = new Map<string, Set<string>>();
  for (const n of input.nodes) adj.set(n, new Set());
  for (const e of input.edges) {
    adj.get(e.from)?.add(e.to);
    if (!input.directed) adj.get(e.to)?.add(e.from);
  }
  if (!adj.has(source) || !adj.has(target)) {
    hooks.onDone?.(false, Infinity);
    return { found: false, dist: Infinity };
  }
  const distS = new Map<string, number>([[source, 0]]);
  const distT = new Map<string, number>([[target, 0]]);
  const qS: string[] = [source];
  const qT: string[] = [target];
  let best = Infinity;

  while (qS.length > 0 && qT.length > 0) {
    // 选较小一侧
    const expandSide = qS.length <= qT.length ? 'src' : 'tgt';
    const q = expandSide === 'src' ? qS : qT;
    const dist = expandSide === 'src' ? distS : distT;
    const other = expandSide === 'src' ? distT : distS;
    const levelSize = q.length;
    for (let i = 0; i < levelSize; i++) {
      const u = q.shift()!;
      const du = dist.get(u)!;
      hooks.onExpand?.(expandSide, u);
      for (const v of adj.get(u) ?? []) {
        if (dist.has(v)) continue;
        dist.set(v, du + 1);
        q.push(v);
        if (other.has(v)) {
          const total = du + 1 + other.get(v)!;
          if (total < best) {
            best = total;
            hooks.onMeet?.(v, total);
          }
        }
      }
    }
    if (best < Infinity) {
      hooks.onDone?.(true, best);
      return { found: true, dist: best };
    }
  }
  hooks.onDone?.(false, Infinity);
  return { found: false, dist: Infinity };
}
