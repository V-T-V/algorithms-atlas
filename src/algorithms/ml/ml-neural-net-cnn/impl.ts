// 一维卷积层前向 · 实现
export function conv1d(input: number[], kernel: number[]): number[] {
  const k = kernel.length,
    out: number[] = [];
  for (let i = 0; i <= input.length - k; i++) {
    let s = 0;
    for (let j = 0; j < k; j++) s += input[i + j]! * kernel[j]!;
    out.push(Math.tanh(s));
  }
  return out;
}
export function maxPool1d(input: number[], poolSize = 2): number[] {
  const out: number[] = [];
  for (let i = 0; i < input.length; i += poolSize) {
    let m = -Infinity;
    for (let j = 0; j < poolSize && i + j < input.length; j++) m = Math.max(m, input[i + j]!);
    out.push(m);
  }
  return out;
}
