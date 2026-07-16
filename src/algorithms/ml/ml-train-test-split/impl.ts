// 训练/测试集划分 · 实现
export function trainTestSplit<T>(data: T[], testRatio = 0.2, seed = 1): { train: T[]; test: T[] } {
  let s = seed >>> 0;
  const rand = (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const arr = data.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  const cut = Math.floor(arr.length * testRatio);
  return { test: arr.slice(0, cut), train: arr.slice(cut) };
}
