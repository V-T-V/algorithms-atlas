// =============================================================================
// Relabel-to-Front · 纯算法实现
// push-relabel + 链表「移到前端」优化，O(V³)。
// =============================================================================

export interface RtfEdgeInput {
  from: number;
  to: number;
  cap: number;
}

export interface RtfHooks {
  onDischarge?: (node: number, oldHeight: number, newHeight: number) => void;
  onRelabel?: (node: number, oldH: number, newH: number) => void;
  onPush?: (from: number, to: number, flow: number, fromExcess: number) => void;
  onMoveToFront?: (node: number) => void;
  onDone?: (maxFlow: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/**
 * Relabel-to-Front 最大流。
 *
 * @param n 节点数
 * @param edges 边
 * @param s 源
 * @param t 汇
 * @param hooks 钩子
 * @returns 最大流值
 */
export function relabelToFront(
  n: number,
  edges: readonly RtfEdgeInput[],
  s: number,
  t: number,
  hooks: RtfHooks = {},
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

  const h = new Array<number>(n).fill(0);
  const e = new Array<number>(n).fill(0);
  const current = new Array<number>(n).fill(0); // current arc pointer
  h[s] = n;

  // 饱和推送 s 的出边
  for (const a of g[s]!) {
    if (a.cap > 0) {
      const flow = a.cap;
      a.cap = 0;
      g[a.to]![a.rev]!.cap += flow;
      e[a.to] = e[a.to]! + flow;
    }
  }

  // 链表：用 next 数组 + head 指针模拟
  const listNodes: number[] = [];
  for (let v = 0; v < n; v++) {
    if (v !== s && v !== t) listNodes.push(v);
  }
  const next = new Array<number>(n).fill(-1);
  for (let i = 0; i < listNodes.length - 1; i++) {
    next[listNodes[i]!] = listNodes[i + 1]!;
  }
  let head = listNodes.length > 0 ? listNodes[0]! : -1;

  const discharge = (u: number): boolean => {
    // 返回 u 是否被 relabel
    let relabeled = false;
    while (e[u]! > 0) {
      if (current[u]! >= g[u]!.length) {
        // relabel
        const oldH = h[u]!;
        let minH = Infinity;
        for (const a of g[u]!) {
          if (a.cap > 0 && h[a.to]! < minH) minH = h[a.to]!;
        }
        h[u] = minH + 1;
        current[u] = 0;
        relabeled = true;
        hooks.onRelabel?.(u, oldH, h[u]!);
        hooks.onDischarge?.(u, oldH, h[u]!);
      } else {
        const a = g[u]![current[u]!]!;
        if (a.cap > 0 && h[u] === h[a.to]! + 1) {
          // push
          const push = Math.min(e[u]!, a.cap);
          a.cap -= push;
          g[a.to]![a.rev]!.cap += push;
          e[u] = e[u]! - push;
          e[a.to] = e[a.to]! + push;
          hooks.onPush?.(u, a.to, push, e[u]!);
        } else {
          current[u] = current[u]! + 1;
        }
      }
    }
    return relabeled;
  };

  let u = head;
  // 用一个数组记录每个节点的前驱，便于「移到前端」
  const prevOf = new Array<number>(n).fill(-1);
  {
    let p = -1;
    let c = head;
    while (c !== -1) {
      prevOf[c] = p;
      p = c;
      c = next[c]!;
    }
  }

  while (u !== -1) {
    const relabeled = discharge(u);
    if (relabeled && u !== head) {
      // 移到前端
      const p = prevOf[u]!;
      const nx = next[u]!;
      // 从原位置摘除
      if (p !== -1) next[p] = nx;
      if (nx !== -1) prevOf[nx] = p;
      // 插入头部
      next[u] = head;
      prevOf[head] = u;
      head = u;
      prevOf[u] = -1;
      hooks.onMoveToFront?.(u);
      u = head;
    } else {
      u = next[u]!;
    }
  }

  const maxFlow = e[t]!;
  hooks.onDone?.(maxFlow);
  return maxFlow;
}
