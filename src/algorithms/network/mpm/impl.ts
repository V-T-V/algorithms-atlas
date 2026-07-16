// =============================================================================
// MPM 算法 · 纯算法实现
// 分层网络 + 每阶段找 pot 最小节点为瓶颈，向源/汇双向推进。
// =============================================================================

export interface MpmEdgeInput {
  from: number;
  to: number;
  cap: number;
}

export interface MpmHooks {
  onLevel?: (level: number[], reachable: boolean) => void;
  onPotential?: (pots: number[], bottleneckNode: number, bottleneckValue: number) => void;
  onPush?: (path: number[], flow: number, totalFlow: number) => void;
  onPhase?: (phase: number, phaseFlow: number, totalFlow: number) => void;
  onDone?: (totalFlow: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/**
 * MPM 最大流。
 */
export function mpm(
  n: number,
  edges: readonly MpmEdgeInput[],
  s: number,
  t: number,
  hooks: MpmHooks = {},
): number {
  if (n <= 0 || s === t) {
    hooks.onDone?.(0);
    return 0;
  }

  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };
  for (const e of edges) {
    if (e.cap > 0) addEdge(e.from, e.to, e.cap);
  }

  const level = new Array<number>(n).fill(-1);
  const inCap = new Array<number>(n).fill(0);
  const outCap = new Array<number>(n).fill(0);
  const removed = new Array<boolean>(n).fill(false);

  const bfs = (): boolean => {
    level.fill(-1);
    for (let i = 0; i < n; i++) removed[i] = false;
    level[s] = 0;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      for (const a of g[u]!) {
        if (a.cap > 0 && level[a.to]! < 0) {
          level[a.to] = level[u]! + 1;
          queue.push(a.to);
        }
      }
    }
    const reachable = level[t]! >= 0;
    hooks.onLevel?.([...level], reachable);
    return reachable;
  };

  const computePots = (): number[] => {
    inCap.fill(0);
    outCap.fill(0);
    for (let u = 0; u < n; u++) {
      if (removed[u] || level[u]! < 0) continue;
      for (const a of g[u]!) {
        if (a.cap > 0 && level[a.to] === level[u]! + 1 && !removed[a.to]) {
          outCap[u] = outCap[u]! + a.cap;
          inCap[a.to] = inCap[a.to]! + a.cap;
        }
      }
    }
    const pots = new Array<number>(n).fill(0);
    for (let u = 0; u < n; u++) {
      if (removed[u] || level[u]! < 0) {
        pots[u] = 0;
        continue;
      }
      if (u === s || u === t) {
        pots[u] = Infinity;
      } else {
        pots[u] = Math.min(inCap[u]!, outCap[u]!);
      }
    }
    return pots;
  };

  // 从 u 沿分层网络向源回溯推送 flow（用于把瓶颈节点的入流量满载）
  const pushBack = (u: number, flow: number): void => {
    if (u === s || flow === 0) return;
    // 找到指向 u 的入边（在分层网络中），逐条回推
    let remaining = flow;
    for (const a of g[u]!) {
      // 反向边 a 是 别人 → u 的正向边
      if (remaining === 0) break;
      const revArc = g[a.to]![a.rev]!;
      if (revArc.cap > 0 && level[a.to]! === level[u]! - 1 && !removed[a.to]) {
        const push = Math.min(remaining, revArc.cap);
        revArc.cap -= push;
        a.cap += push;
        if (a.to !== s) {
          // 继续向上推
          pushBack(a.to, push);
        }
        remaining -= push;
      }
    }
  };

  // 从 u 沿分层网络向汇正向推送 flow
  const pushForward = (u: number, flow: number): void => {
    if (u === t || flow === 0) return;
    let remaining = flow;
    for (const a of g[u]!) {
      if (remaining === 0) break;
      if (a.cap > 0 && level[a.to] === level[u]! + 1 && !removed[a.to]) {
        const push = Math.min(remaining, a.cap);
        a.cap -= push;
        g[a.to]![a.rev]!.cap += push;
        if (a.to !== t) {
          pushForward(a.to, push);
        }
        remaining -= push;
      }
    }
  };

  let maxFlow = 0;
  let phase = 0;

  while (bfs()) {
    phase += 1;
    let phaseFlow = 0;
    for (;;) {
      const pots = computePots();
      // 找 pot 最小的有效节点（非 s/t，且 level ≥ 0）
      let minNode = -1;
      let minPot = Infinity;
      for (let u = 0; u < n; u++) {
        if (u === s || u === t) continue;
        if (removed[u] || level[u]! < 0) continue;
        if (pots[u]! < minPot) {
          minPot = pots[u]!;
          minNode = u;
        }
      }
      if (minNode === -1 || minPot === 0 || minPot === Infinity) break;
      hooks.onPotential?.(pots, minNode, minPot);
      // 从 minNode 向源回溯 + 向汇正向，各推 minPot 单位
      pushBack(minNode, minPot);
      pushForward(minNode, minPot);
      phaseFlow += minPot;
      maxFlow += minPot;
      hooks.onPush?.([minNode], minPot, maxFlow);
      removed[minNode] = true;
    }
    hooks.onPhase?.(phase, phaseFlow, maxFlow);
  }

  hooks.onDone?.(maxFlow);
  return maxFlow;
}
