// =============================================================================
// 最小点覆盖（2-近似）· 纯算法实现
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface VertexCoverHooks {
  onPick?: (u: string, v: string) => void;
  onDone?: (cover: string[], size: number) => void;
}

export function minVertexCoverApprox(input: GraphInput, hooks: VertexCoverHooks = {}): string[] {
  const cover = new Set<string>();
  // 极大匹配：扫所有边，两端都没被覆盖就纳入
  for (const e of input.edges) {
    if (!cover.has(e.from) && !cover.has(e.to)) {
      cover.add(e.from);
      cover.add(e.to);
      hooks.onPick?.(e.from, e.to);
    }
  }
  const result = [...cover].sort();
  hooks.onDone?.(result, result.length);
  return result;
}
