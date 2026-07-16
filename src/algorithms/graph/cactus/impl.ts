// =============================================================================
// 仙人掌 DP（Cactus DP · 求仙人掌图的直径）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 仙人掌图（cactus）：每条边至多属于一个简单环。本实现求其直径（两点最长最短路径）。
// 思路：DFS。桥边按树直径 DP；对每个环（由一条回边 src→top 标识），
//       沿父链收集环上节点与弧长，把各子树链经「环上较短弧」两两合并更新直径，
//       并用「子树链 + 较短弧」刷新环顶 f。
// =============================================================================

/** 无向仙人掌图输入（带边权）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface CactusHooks {
  /** 首次访问节点 v。 */
  onDiscover?: (v: string) => void;
  /** 发现一条树边 u→v（向下）。 */
  onTreeEdge?: (u: string, v: string, w: number) => void;
  /** 发现一条回边 src→top（top 是 src 的祖先）。 */
  onBackEdge?: (src: string, top: string, w: number) => void;
  /** 处理一个环：top 为环顶，cycleLen 为环总长。 */
  onCycle?: (top: string, cycleLen: number) => void;
  /** 更新当前全局直径为 d。 */
  onUpdateDiameter?: (d: number) => void;
}

export interface CactusResult {
  /** 仙人掌直径。 */
  diameter: number;
}

/** 一条回边信息：src 指向祖先 top，边权 w。 */
interface BackEdgeInfo {
  src: string;
  top: string;
  w: number;
}

/**
 * 仙人掌图直径 DP。
 *
 * @param input 仙人掌图
 * @param hooks 可选事件钩子
 * @returns 直径
 */
export function cactus(input: GraphInput, hooks: CactusHooks = {}): CactusResult {
  const { nodes, edges } = input;

  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push({ to: e.to, w: e.weight });
    if (adj.has(e.to) && e.from !== e.to) adj.get(e.to)!.push({ to: e.from, w: e.weight });
  }
  for (const list of adj.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));

  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const f = new Map<string, number>(); // 子树最长下伸链
  const par = new Map<string, { p: string; w: number } | null>();
  // 环顶 → 该环对应的回边（src→top），用于在环顶处收集环
  const cycleAtTop = new Map<string, BackEdgeInfo>();
  let timer = 0;
  let diameter = 0;

  const update = (x: number): void => {
    if (x > diameter) {
      diameter = x;
      hooks.onUpdateDiameter?.(diameter);
    }
  };

  // 处理以 top 为环顶的环：环 = [top, ..., src]（沿 src 父链回溯到 top）
  const handleCycle = (top: string, info: BackEdgeInfo): void => {
    // 收集环节点 top=ring[0] ... ring[k-1]=src
    const ring: string[] = [];
    const arc: number[] = []; // arc[i] = 从 top 沿环到 ring[i] 的累计长度
    ring.push(top);
    arc.push(0);
    // 从 src 向上到 top（不含 top），弧从 top 侧累计：需要逆向
    const chain: string[] = [];
    const chainW: number[] = [];
    let curN: string = info.src;
    const curW = info.w; // src→top 的回边权（连接 src 与 top）
    chain.push(curN);
    chainW.push(curW);
    let guard = 0;
    while (curN !== top && guard <= nodes.length) {
      guard++;
      const pp = par.get(curN);
      if (!pp) break;
      curN = pp.p;
      chain.push(curN);
      chainW.push(pp.w);
    }
    // chain = [src, ..., top]，chainW[i] 连接 chain[i] 与 chain[i+1]
    // 环顺序：top, ..., src；弧从 top 累计
    // 反转：ring = [top, chain[k-2], ..., chain[0]=src]
    for (let i = chain.length - 2; i >= 0; i--) {
      ring.push(chain[i]!);
      // arc 累加：连接 ring 末尾与新节点 的边权 = chainW[i]
      arc.push((arc[arc.length - 1] ?? 0) + chainW[i]!);
    }
    const k = ring.length;
    // 环总长 = 顶→src 的环路径长(arc[k-1]) + 关闭环的回边权
    const total = (arc[k - 1] ?? 0) + info.w;
    hooks.onCycle?.(top, total);
    // 两两组合：环上两子树链经「较短弧」拼成路径
    for (let i = 1; i < k; i++) {
      for (let j = i + 1; j < k; j++) {
        const a = arc[i]!;
        const b = arc[j]!;
        const via = b - a;
        const other = total - via;
        const pathLen = (f.get(ring[i]!) ?? 0) + (f.get(ring[j]!) ?? 0) + Math.min(via, other);
        update(pathLen);
      }
    }
    // 子树链经较短弧回到 top
    let best = f.get(top) ?? 0;
    for (let i = 1; i < k; i++) {
      const shorter = Math.min(arc[i]!, total - arc[i]!);
      best = Math.max(best, (f.get(ring[i]!) ?? 0) + shorter);
    }
    f.set(top, best);
  };

  const dfs = (u: string, parent: { p: string; w: number } | null): void => {
    timer++;
    dfn.set(u, timer);
    low.set(u, timer);
    f.set(u, 0);
    par.set(u, parent);
    hooks.onDiscover?.(u);

    const seenParent = new Map<string, number>();
    for (const e of adj.get(u) ?? []) {
      const v = e.to;
      const seen = seenParent.get(v) ?? 0;
      const isParentEdge = parent && v === parent.p && seen === 0;
      if (isParentEdge) {
        seenParent.set(v, seen + 1);
        continue;
      }
      seenParent.set(v, seen + 1);
      if (!dfn.has(v)) {
        hooks.onTreeEdge?.(u, v, e.w);
        dfs(v, { p: u, w: e.w });
        low.set(u, Math.min(low.get(u) ?? Infinity, low.get(v) ?? Infinity));
        if ((low.get(v) ?? Infinity) > (dfn.get(u) ?? Infinity)) {
          // 桥：树直径式合并
          const cand = (f.get(v) ?? 0) + e.w;
          update((f.get(u) ?? 0) + cand);
          f.set(u, Math.max(f.get(u) ?? 0, cand));
        } else if ((low.get(v) ?? Infinity) === (dfn.get(u) ?? Infinity)) {
          // u 是某环顶：该环的回边已记录在 cycleAtTop[u]
          const info = cycleAtTop.get(u);
          if (info) {
            handleCycle(u, info);
            cycleAtTop.delete(u);
          }
        }
      } else if ((dfn.get(v) ?? 0) < (dfn.get(u) ?? Infinity)) {
        // 回边 u→v：v 是 u 的祖先，标识一个以 v 为顶的环
        low.set(u, Math.min(low.get(u) ?? Infinity, dfn.get(v) ?? Infinity));
        hooks.onBackEdge?.(u, v, e.w);
        // 记录该回边（仅保留第一条；cactus 下每环恰一条回边）
        if (!cycleAtTop.has(v)) cycleAtTop.set(v, { src: u, top: v, w: e.w });
      }
    }
  };

  for (const n of nodes) {
    if (!dfn.has(n)) dfs(n, null);
  }

  return { diameter };
}
