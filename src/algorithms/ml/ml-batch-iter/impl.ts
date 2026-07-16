// Mini-Batch 迭代器 · 实现
export function* miniBatchIter<T>(data: T[], batchSize: number): Generator<T[]> {
  if (batchSize <= 0) throw new RangeError('batch 必须 > 0');
  for (let i = 0; i < data.length; i += batchSize) yield data.slice(i, i + batchSize);
}
