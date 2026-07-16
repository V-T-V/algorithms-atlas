// =============================================================================
// 匈牙利算法（Kuhn 增广路二分图匹配）· 纯算法实现
// 零 DOM 依赖，可独立单测。
// 左侧 0..nLeft-1，右侧 0..nRight-1。
// =============================================================================

export type BipartiteEdge = [number, number];

/** 事件钩子。 */
export interface HungarianHooks {
  /** 尝试为左侧点 l 找增广路。 */
  onTryLeft?: (l: number) => void;
  /** 访问右侧点 r（来自左侧 l）。matchedTo 为 r 当前匹配的左侧点（-1 未匹配）。 */
  onVisit?: (l: number, r: number, matchedTo: number) => void;
  /** 增广成功：把 l 与 r 匹配（可能是翻转后的结果）。 */
  onAugment?: (l: number, r: number) => void;
  /** 算法结束。 */
  onDone?: (totalMatches: number) => void;
}

/**
 * 匈牙利（Kuhn）二分图最大匹配。
 *
 * @param nLeft 左侧节点数
 * @param nRight 右侧节点数
 * @param edges 边 [left, right]
 * @param hooks 可选钩子
 * @returns 最大匹配数
 */
export function hungarian(
  nLeft: number,
  nRight: number,
  edges: readonly BipartiteEdge[],
  hooks: HungarianHooks = {},
): number {
  if (nLeft === 0 || nRight === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const adj: number[][] = Array.from({ length: nLeft }, () => []);
  for (const [l, r] of edges) {
    if (l >= 0 && l < nLeft && r >= 0 && r < nRight) adj[l]!.push(r);
  }

  const matchR = new Array<number>(nRight).fill(-1); // 右侧点匹配的左侧点
  let matches = 0;

  // 为左侧 l 尝试增广
  const tryKuhn = (l: number, visited: boolean[]): boolean => {
    hooks.onTryLeft?.(l);
    for (const r of adj[l]!) {
      if (visited[r]) continue;
      visited[r] = true;
      const owner = matchR[r]!;
      hooks.onVisit?.(l, r, owner);
      if (owner === -1 || tryKuhn(owner, visited)) {
        matchR[r] = l;
        hooks.onAugment?.(l, r);
        return true;
      }
    }
    return false;
  };

  for (let l = 0; l < nLeft; l++) {
    const visited = new Array<boolean>(nRight).fill(false);
    if (tryKuhn(l, visited)) {
      matches++;
    }
  }

  hooks.onDone?.(matches);
  return matches;
}
