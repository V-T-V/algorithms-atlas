// gradient-boost · ml类算法实现

export function gradientboost(data: number[][]): number[] {
  return data.map((row) => row.reduce((a, b) => a + b, 0) / row.length);
}
