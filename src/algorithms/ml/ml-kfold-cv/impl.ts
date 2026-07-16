// K 折交叉验证索引 · 实现
export interface Fold {
  trainIdx: number[];
  testIdx: number[];
}
export function kFoldIndices(n: number, k: number): Fold[] {
  if (k <= 0 || n <= 0) throw new RangeError('n,k 必须为正');
  const idx = Array.from({ length: n }, (_, i) => i);
  const folds: Fold[] = [];
  const size = Math.floor(n / k);
  for (let f = 0; f < k; f++) {
    const start = f * size,
      end = f === k - 1 ? n : start + size;
    const test = idx.slice(start, end);
    const train = idx.filter((i) => i < start || i >= end);
    folds.push({ trainIdx: train, testIdx: test });
  }
  return folds;
}
