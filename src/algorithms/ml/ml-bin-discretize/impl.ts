// 等宽分箱 · 实现
export function equalWidthBinning(values: number[], k: number): number[] {
  if (k <= 0) throw new RangeError('箱数必须为正');
  const mn = Math.min(...values),
    mx = Math.max(...values);
  const w = (mx - mn) / k || 1;
  return values.map((v) => {
    let b = Math.floor((v - mn) / w);
    if (b >= k) b = k - 1;
    return b;
  });
}
