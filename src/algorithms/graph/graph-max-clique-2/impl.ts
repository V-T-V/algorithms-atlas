// =============================================================================
// 最大团（回溯）· 纯算法实现
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface MaxCliqueHooks {
  onExtend?: (clique: string[], candidates: string[]) => void;
  onBetter?: (size: number, clique: string[]) => void;
  onDone?: (size: number, clique: string[]) => void;
}

export function maxClique(input: GraphInput, hooks: MaxCliqueHooks = {}): string[] {
  const adj = new Map<string, Set<string>>();
  for (const n of input.nodes) adj.set(n, new Set());
  for (const e of input.edges) {
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
  }
  const sortedNodes = [...input.nodes].sort();
  let best: string[] = [];

  const dfs = (R: string[], P: string[]): void => {
    if (P.length === 0) {
      if (R.length > best.length) {
        best = [...R];
        hooks.onBetter?.(best.length, best);
      }
      return;
    }
    // 剪枝：即使把 P 全加入也无法超过 best
    if (R.length + P.length <= best.length) return;
    hooks.onExtend?.(R, P);
    const pivot = P[0]!;
    // 选 pivot：与 pivot 不相邻的需各自尝试；这里简化逐个尝试
    for (let i = 0; i < P.length; i++) {
      if (R.length + (P.length - i) <= best.length) return;
      const v = P[i]!;
      const newP: string[] = [];
      for (const c of P) {
        if (c === v) continue;
        if (adj.get(v)?.has(c)) newP.push(c);
      }
      dfs([...R, v], newP);
    }
  };

  dfs([], sortedNodes);
  hooks.onDone?.(best.length, best);
  return best;
}
