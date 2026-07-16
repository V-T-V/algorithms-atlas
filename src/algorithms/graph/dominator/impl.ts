// =============================================================================
// 支配树（Dominator Tree）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 采用 Cooper-Harvey-Kennedy 迭代支配者算法（数据流不动点）：
//   idom[start]=start；对其它节点 v：idom[v] =（所有能到达 v 的前驱的 idom 的交）。
// 用反向后序（RPO）遍历加速收敛（一轮即可）。
// =============================================================================

/** 有向图输入（流程图，指定起点 start）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  /** 支配关系的起点（根）。 */
  start: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface DominatorHooks {
  /** 在 RPO 序中访问节点 v（i 为 RPO 下标）。 */
  onVisit?: (v: string, i: number) => void;
  /** 考察前驱 p → v 进行交集计算。 */
  onIntersect?: (p: string, v: string, newIdom: string) => void;
  /** 更新 idom[v] = newIdom。 */
  onSetIdom?: (v: string, newIdom: string) => void;
  /** 算法完成：dominator 树（父 = idom）。 */
  onDone?: (idom: Map<string, string | null>) => void;
}

export interface DominatorResult {
  /** 每个可达节点 v 的直接支配者（idom[start]=start 本身）；不可达节点无条目。 */
  idom: Map<string, string>;
  /** 支配树孩子表：children[u] = u 在支配树中的儿子集合。 */
  children: Map<string, string[]>;
}

/**
 * 求支配树（Cooper-Harvey-Kennedy 迭代算法）。
 *
 * @param input 有向图 + 起点
 * @param hooks 可选事件钩子
 * @returns idom 表与支配树孩子表
 */
export function dominator(input: GraphInput, hooks: DominatorHooks = {}): DominatorResult {
  const { nodes, edges, start } = input;
  if (!nodes.includes(start)) return { idom: new Map(), children: new Map() };

  // 前驱表与邻接表（仅用于 BFS/RPO）
  const preds = new Map<string, string[]>();
  const succ = new Map<string, string[]>();
  for (const n of nodes) {
    preds.set(n, []);
    succ.set(n, []);
  }
  for (const e of edges) {
    if (succ.has(e.from) && preds.has(e.to)) {
      succ.get(e.from)!.push(e.to);
      preds.get(e.to)!.push(e.from);
    }
  }

  // 从 start 的 BFS/DFS 求「可达集」与 RPO（反向后序）
  const rpo: string[] = [];
  const reachable = new Set<string>();
  const dfsStack: Array<{ v: string; ei: number }> = [{ v: start, ei: 0 }];
  reachable.add(start);
  while (dfsStack.length > 0) {
    const f = dfsStack[dfsStack.length - 1]!;
    const ns = succ.get(f.v) ?? [];
    if (f.ei < ns.length) {
      const w = ns[f.ei]!;
      f.ei++;
      if (!reachable.has(w)) {
        reachable.add(w);
        dfsStack.push({ v: w, ei: 0 });
      }
    } else {
      dfsStack.pop();
      rpo.push(f.v);
    }
  }
  rpo.reverse(); // 反向后序 = RPO

  const rpoIndex = new Map<string, number>();
  rpo.forEach((v, i) => {
    rpoIndex.set(v, i);
    hooks.onVisit?.(v, i);
  });

  // idom 初始化：start→start，其余未定（undefined）
  const idom = new Map<string, string>();
  idom.set(start, start);

  // 求两节点 a、b 的最近公共支配者（按 RPO 下标向上走）
  const intersect = (b1: string, b2: string): string => {
    let f1 = b1;
    let f2 = b2;
    while (f1 !== f2) {
      while ((rpoIndex.get(f1) ?? 0) > (rpoIndex.get(f2) ?? 0)) {
        f1 = idom.get(f1)!;
      }
      while ((rpoIndex.get(f2) ?? 0) > (rpoIndex.get(f1) ?? 0)) {
        f2 = idom.get(f2)!;
      }
    }
    return f1;
  };

  // 不动点迭代（RPO 下基本 2 轮收敛）
  let changed = true;
  while (changed) {
    changed = false;
    for (const v of rpo) {
      if (v === start) continue;
      // 找第一个已处理（idom 已设）的前驱
      let newIdom: string | undefined;
      for (const p of preds.get(v) ?? []) {
        if (!reachable.has(p)) continue;
        if (idom.has(p)) {
          if (newIdom === undefined) newIdom = p;
          else {
            hooks.onIntersect?.(p, v, newIdom);
            newIdom = intersect(p, newIdom);
          }
        }
      }
      if (newIdom !== undefined && idom.get(v) !== newIdom) {
        idom.set(v, newIdom);
        hooks.onSetIdom?.(v, newIdom);
        changed = true;
      }
    }
  }

  // 构建支配树孩子表
  const children = new Map<string, string[]>();
  for (const n of nodes) children.set(n, []);
  for (const [v, d] of idom) {
    if (v !== start) children.get(d)!.push(v);
  }

  hooks.onDone?.(idom);
  return { idom, children };
}
