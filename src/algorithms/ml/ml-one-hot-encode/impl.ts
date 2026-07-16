// 独热编码 · 实现
export function oneHot(labels: number[], k: number): number[][] {
  return labels.map((l) => {
    const v = new Array<number>(k).fill(0);
    if (l >= 0 && l < k) v[l] = 1;
    return v;
  });
}
