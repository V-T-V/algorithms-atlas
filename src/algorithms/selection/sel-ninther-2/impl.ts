// Ninther v2 · 实现
export interface N9Hooks {
  onPick?: (sample: number[]) => void;
  onResult?: (pivot: number) => void;
}
function median3(a: number, b: number, c: number): number {
  if ((a <= b && b <= c) || (c <= b && b <= a)) return b;
  if ((b <= a && a <= c) || (c <= a && a <= b)) return a;
  return c;
}
export function ninther(arr: number[], hooks: N9Hooks = {}): number {
  if (arr.length < 9) {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(arr.length / 2)]!;
  }
  const s = [...arr].sort(() => 0); // 不变序，只复制
  // 采样 9 个（均匀）
  const idx = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => Math.floor((i * arr.length) / 9));
  const sample = idx.map((i) => arr[i]!);
  hooks.onPick?.(sample);
  const m1 = median3(sample[0]!, sample[1]!, sample[2]!);
  const m2 = median3(sample[3]!, sample[4]!, sample[5]!);
  const m3 = median3(sample[6]!, sample[7]!, sample[8]!);
  const pivot = median3(m1, m2, m3);
  hooks.onResult?.(pivot);
  void s;
  return pivot;
}
