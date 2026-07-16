// =============================================================================
// Kuhn 匈牙利增增路匹配（二分图最大基数匹配）· 纯算法实现
// 逐个左点 DFS 找增广路。零 DOM 依赖，可独立单测。
// 左部 0..nLeft-1，右部 0..nRight-1，边 edges[i] = [left, right]。
// =============================================================================

export interface KuhnHooks {
  /** 开始尝试为左点 u 找增广路。 */
  onTryLeft?: (u: number) => void;
  /** DFS 访问右点 r（来自左点 u），给出是否成功占用。 */
  onVisitRight?: (u: number, r: number, success: boolean) => void;
  /** 左点 u 找到增广路（成功匹配）或失败。 */
  onResult?: (u: number, matched: boolean) => void;
  /** 算法结束，给出最大匹配数。 */
  onDone?: (size: number) => void;
}

export interface KuhnEdge {
  from: number;
  to: number;
}

/**
 * Kuhn 二分图最大匹配。
 *
 * @param nLeft 左部节点数
 * @param nRight 右部节点数
 * @param edges 边列表 {from (左), to (右)}
 * @param hooks 可选钩子
 * @returns 最大匹配数
 */
export function kuhnMatching(
  nLeft: number,
  nRight: number,
  edges: readonly KuhnEdge[],
  hooks: KuhnHooks = {},
): number {
  // 邻接表：左点 → 右点列表
  const adj: number[][] = Array.from({ length: nLeft }, () => []);
  for (const e of edges) {
    if (e.from >= 0 && e.from < nLeft && e.to >= 0 && e.to < nRight) {
      adj[e.from]!.push(e.to);
    }
  }

  const matchR = new Array<number>(nRight).fill(-1);
  const visited: boolean[] = new Array<boolean>(nRight).fill(false);

  // 尝试为左点 u 找增广路；返回是否成功
  const tryKuhn = (u: number): boolean => {
    const nbrs = adj[u]!;
    for (let i = 0; i < nbrs.length; i++) {
      const r = nbrs[i]!;
      if (visited[r]) continue;
      visited[r] = true;
      // r 未匹配，或 r 的当前匹配者能让出
      const m = matchR[r]!;
      if (m === -1 || tryKuhn(m)) {
        matchR[r] = u;
        hooks.onVisitRight?.(u, r, true);
        return true;
      }
      hooks.onVisitRight?.(u, r, false);
    }
    return false;
  };

  let size = 0;
  for (let u = 0; u < nLeft; u++) {
    hooks.onTryLeft?.(u);
    visited.fill(false);
    const ok = tryKuhn(u);
    if (ok) size++;
    hooks.onResult?.(u, ok);
  }

  hooks.onDone?.(size);
  return size;
}

/** 返回匹配结果（右→左）。 */
export function kuhnMatchingResult(
  nLeft: number,
  nRight: number,
  edges: readonly KuhnEdge[],
): Array<{ left: number; right: number }> {
  const adj: number[][] = Array.from({ length: nLeft }, () => []);
  for (const e of edges) {
    if (e.from >= 0 && e.from < nLeft && e.to >= 0 && e.to < nRight) {
      adj[e.from]!.push(e.to);
    }
  }
  const matchR = new Array<number>(nRight).fill(-1);
  const visited: boolean[] = new Array<boolean>(nRight).fill(false);
  const tryKuhn = (u: number): boolean => {
    const nbrs = adj[u]!;
    for (const r of nbrs) {
      if (visited[r]!) continue;
      visited[r] = true;
      const m = matchR[r]!;
      if (m === -1 || tryKuhn(m)) {
        matchR[r] = u;
        return true;
      }
    }
    return false;
  };
  for (let u = 0; u < nLeft; u++) {
    visited.fill(false);
    tryKuhn(u);
  }
  const pairs: Array<{ left: number; right: number }> = [];
  for (let r = 0; r < nRight; r++) {
    if (matchR[r]! !== -1) pairs.push({ left: matchR[r]!, right: r });
  }
  return pairs;
}
