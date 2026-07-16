// =============================================================================
// 二分图最小点覆盖（Bipartite Minimum Vertex Cover, Kőnig 定理）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// Kőnig 定理：二分图最大匹配数 = 最小点覆盖数。
// 求「最小点覆盖」：先求最大匹配，再从「未匹配的左部点」出发沿交替路（匹配边/非匹配边
// 交替）DFS 标记；左部未标记 + 右部已标记的点构成最小点覆盖。
// =============================================================================

/** 二分图输入。 */
export interface BipartiteInput {
  left: readonly string[];
  right: readonly string[];
  /** 连边（from∈left, to∈right）。 */
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface BistarHooks {
  /** 尝试为左部点 u 增广（找未匹配右部点或挪动）。result=是否成功增广。 */
  onTryMatch?: (u: string, success: boolean) => void;
  /** 找到一条匹配对（u∈left, v∈right）。 */
  onMatch?: (u: string, v: string) => void;
  /** 从未匹配左部点出发的交替路标记。 */
  onAlternating?: (visitedLeft: string[], visitedRight: string[]) => void;
  /** 算法完成：点覆盖集合（左部 + 右部）。 */
  onCover?: (coverLeft: string[], coverRight: string[]) => void;
}

export interface BistarResult {
  /** 最小点覆盖大小。 */
  coverSize: number;
  /** 覆盖中的左部点。 */
  coverLeft: string[];
  /** 覆盖中的右部点。 */
  coverRight: string[];
  /** 最大匹配数（= 点覆盖数）。 */
  matchCount: number;
  /** 左→右 的匹配。 */
  matchLeft: Map<string, string | null>;
  /** 右→左 的匹配。 */
  matchRight: Map<string, string | null>;
}

/**
 * 二分图最小点覆盖（Kőnig 定理 + 匈牙利匹配）。
 *
 * @param input 二分图
 * @param hooks 可选事件钩子
 * @returns 最小点覆盖
 */
export function bistar(input: BipartiteInput, hooks: BistarHooks = {}): BistarResult {
  const { left, right, edges } = input;
  const adj = new Map<string, string[]>();
  for (const l of left) adj.set(l, []);
  for (const e of edges) adj.get(e.from)?.push(e.to);

  const matchL = new Map<string, string | null>();
  const matchR = new Map<string, string | null>();
  for (const l of left) matchL.set(l, null);
  for (const r of right) matchR.set(r, null);

  // 匈牙利增广
  const tryAugment = (u: string, visited: Set<string>): boolean => {
    for (const v of adj.get(u) ?? []) {
      if (visited.has(v)) continue;
      visited.add(v);
      const owner = matchR.get(v);
      if (owner === null || (owner !== null && tryAugment(owner!, visited))) {
        matchL.set(u, v);
        matchR.set(v, u);
        return true;
      }
    }
    return false;
  };

  let matchCount = 0;
  for (const u of left) {
    const ok = tryAugment(u, new Set());
    hooks.onTryMatch?.(u, ok);
    if (ok) matchCount++;
  }
  for (const [u, v] of matchL) if (v !== null) hooks.onMatch?.(u, v);

  // 从未匹配的左部点出发沿交替路 DFS 标记
  // 交替路：左→右走非匹配边，右→左走匹配边
  const visL = new Set<string>();
  const visR = new Set<string>();
  const dfsAlt = (u: string): void => {
    if (visL.has(u)) return;
    visL.add(u);
    for (const v of adj.get(u) ?? []) {
      if (visR.has(v)) continue;
      // 非匹配边 u→v（无论是否匹配，都标记右侧；但只沿「匹配边」回到左部）
      visR.add(v);
      const owner = matchR.get(v);
      if (owner !== null) dfsAlt(owner!);
    }
  };
  for (const u of left) {
    if (matchL.get(u) === null) dfsAlt(u);
  }
  hooks.onAlternating?.([...visL], [...visR]);

  // 最小点覆盖 = (左部未标记) ∪ (右部已标记)
  const coverLeft: string[] = [];
  const coverRight: string[] = [];
  for (const l of left) if (!visL.has(l)) coverLeft.push(l);
  for (const r of right) if (visR.has(r)) coverRight.push(r);

  hooks.onCover?.(coverLeft, coverRight);
  return {
    coverSize: coverLeft.length + coverRight.length,
    coverLeft,
    coverRight,
    matchCount,
    matchLeft: matchL,
    matchRight: matchR,
  };
}
