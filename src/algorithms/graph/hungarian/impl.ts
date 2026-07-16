// =============================================================================
// 匈牙利算法（Hungarian）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 求二分图最大匹配：对左部每个未匹配点尝试 DFS 找增广路（交替路）。
// =============================================================================

/** 二分图输入。left/right 为两侧节点 id；edges 仅记 left→right。 */
export interface BipartiteGraphInput {
  left: readonly string[];
  right: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 匈牙利算法执行过程中的事件钩子。任一可选。 */
export interface HungarianHooks {
  /** 开始为左部节点 u 尝试寻找增广路。 */
  onTryMatch?: (u: string) => void;
  /** 沿交替路访问边 (u,v)：matched 表示 v 当前是否已与某左部节点匹配。 */
  onVisitEdge?: (u: string, v: string, matched: boolean) => void;
  /** 一条边被翻转纳入匹配：u↔v 成为匹配边（replaced=true 表示覆盖了旧匹配）。 */
  onMatchEdge?: (u: string, v: string, replaced: boolean) => void;
  /** u 找到增广路（found=true）或失败。 */
  onTryResult?: (u: string, found: boolean) => void;
  /** 算法完成：匹配数与匹配对列表。 */
  onDone?: (matchCount: number, pairs: Array<{ left: string; right: string }>) => void;
}

/** 最大匹配结果。 */
export interface MatchingResult {
  matchCount: number;
  /** 匹配对（左部 → 右部）。 */
  pairs: Array<{ left: string; right: string }>;
  /** 右部节点 → 匹配的左部节点（无则 null）。 */
  rightToLeft: Map<string, string | null>;
}

/**
 * 匈牙利算法求二分图最大匹配（DFS 增广路 / Kuhn 算法）。
 *
 * @param input 二分图
 * @param hooks 可选事件钩子
 * @returns 匹配数与匹配对
 */
export function hungarian(input: BipartiteGraphInput, hooks: HungarianHooks = {}): MatchingResult {
  const { left, right, edges } = input;

  // 邻接表：left → right[]
  const adj = new Map<string, string[]>();
  for (const l of left) adj.set(l, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
  }
  // 邻接表按 right 字典序，保证遍历顺序确定
  for (const list of adj.values()) list.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  // 当前匹配：right → left
  const rightToLeft = new Map<string, string | null>();
  for (const r of right) rightToLeft.set(r, null);
  // 本次增广搜索中，右部节点是否已访问（防止重复进入）
  let visited: Set<string>;

  /**
   * 尝试为左部 u 找增广路。
   * 返回是否成功（成功则 rightToLeft 已更新）。
   */
  const tryMatch = (u: string): boolean => {
    for (const v of adj.get(u) ?? []) {
      if (visited.has(v)) continue;
      visited.add(v);
      const curLeft = rightToLeft.get(v) ?? null;
      hooks.onVisitEdge?.(u, v, curLeft !== null);
      // v 未匹配，或 v 的匹配点能找到别的增广路 → 翻转
      if (curLeft === null || tryMatch(curLeft)) {
        rightToLeft.set(v, u);
        hooks.onMatchEdge?.(u, v, curLeft !== null);
        return true;
      }
    }
    return false;
  };

  let matchCount = 0;
  for (const u of left) {
    visited = new Set<string>();
    hooks.onTryMatch?.(u);
    const found = tryMatch(u);
    if (found) matchCount++;
    hooks.onTryResult?.(u, found);
  }

  const pairs: Array<{ left: string; right: string }> = [];
  for (const [r, l] of rightToLeft) {
    if (l !== null) pairs.push({ left: l, right: r });
  }
  // 按 left 排序输出，确定顺序
  pairs.sort((a, b) =>
    a.left < b.left ? -1 : a.left > b.left ? 1 : a.right < b.right ? -1 : a.right > b.right ? 1 : 0,
  );
  hooks.onDone?.(matchCount, pairs);
  return { matchCount, pairs, rightToLeft };
}
