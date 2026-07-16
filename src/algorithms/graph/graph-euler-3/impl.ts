// =============================================================================
// 欧拉回路 Hierholzer（无向图）
// =============================================================================

export interface BipGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface EulerHooks {
  onWalk?: (u: string, v: string) => void;
  onDeadEnd?: (u: string) => void;
  onDone?: (circuit: string[] | null) => void;
}

export function eulerCircuit(input: BipGraphInput, hooks: EulerHooks = {}): string[] | null {
  // 度数检查
  const degree = new Map<string, number>();
  for (const n of input.nodes) degree.set(n, 0);
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }
  for (const d of degree.values()) {
    if (d % 2 !== 0) {
      hooks.onDone?.(null);
      return null;
    }
  }
  if (input.nodes.length === 0) {
    hooks.onDone?.([]);
    return [];
  }
  // 每条无向边对应一个唯一 eid；正反向共享同一 eid 用于标记已用
  const edgeUsed = new Set<number>();
  const adjIdx = new Map<string, Array<{ to: string; eid: number }>>();
  for (const n of input.nodes) adjIdx.set(n, []);
  input.edges.forEach((e, i) => {
    adjIdx.get(e.from)?.push({ to: e.to, eid: i });
    adjIdx.get(e.to)?.push({ to: e.from, eid: i });
  });

  const ptr = new Map<string, number>();
  for (const n of input.nodes) ptr.set(n, 0);
  const path: string[] = [];
  const start = input.nodes[0]!;
  const stack: string[] = [start];
  while (stack.length > 0) {
    const u = stack[stack.length - 1]!;
    let p = ptr.get(u)!;
    const list = adjIdx.get(u) ?? [];
    while (p < list.length && edgeUsed.has(list[p]!.eid)) p++;
    ptr.set(u, p);
    if (p < list.length) {
      const e = list[p]!;
      edgeUsed.add(e.eid);
      ptr.set(u, p + 1);
      stack.push(e.to);
      hooks.onWalk?.(u, e.to);
    } else {
      path.push(u);
      stack.pop();
      hooks.onDeadEnd?.(u);
    }
  }
  path.reverse();
  hooks.onDone?.(path);
  return path;
}
