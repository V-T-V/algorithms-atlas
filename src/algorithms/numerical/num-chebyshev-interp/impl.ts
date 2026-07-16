// =============================================================================
// 切比雪夫插值（第二类节点，重心公式）· 纯算法实现
// =============================================================================

export interface ChebInterp {
  nodes: number[];
  values: number[];
  weights: number[];
}

/** 构建 n+1 个第二类切比雪夫节点上的插值器。 */
export function buildChebInterp(f: (x: number) => number, n: number): ChebInterp {
  if (n < 1) throw new RangeError('n 必须 ≥ 1');
  const nodes: number[] = [];
  const values: number[] = [];
  const weights: number[] = [];
  for (let k = 0; k <= n; k++) {
    const x = Math.cos((k * Math.PI) / n);
    nodes.push(x);
    values.push(f(x));
    // 重心权：c_k · (-1)^k / 2，端点 c=1，中间 c=2
    const c = k === 0 || k === n ? 1 : 2;
    weights.push((c * (k % 2 === 0 ? 1 : -1)) / 2 / n);
  }
  return { nodes, values, weights };
}

/** 重心公式求值。 */
export function evalCheb(interp: ChebInterp, x: number): number {
  const { nodes, values, weights } = interp;
  // 检查 x 是否正好是某节点
  for (let k = 0; k < nodes.length; k++) {
    if (Math.abs(x - nodes[k]!) < 1e-14) return values[k]!;
  }
  let num = 0;
  let den = 0;
  for (let k = 0; k < nodes.length; k++) {
    const t = weights[k]! / (x - nodes[k]!);
    num += t * values[k]!;
    den += t;
  }
  return num / den;
}

/** 便捷：构造后求值。 */
export function chebInterp(f: (x: number) => number, x: number, n: number): number {
  return evalCheb(buildChebInterp(f, n), x);
}
