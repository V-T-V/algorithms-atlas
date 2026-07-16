// ReLU 激活 · 实现
export function relu(x: number): number {
  return x > 0 ? x : 0;
}
export function reluArray(xs: number[]): number[] {
  return xs.map(relu);
}
