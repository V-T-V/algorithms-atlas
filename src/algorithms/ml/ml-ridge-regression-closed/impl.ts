// 岭回归闭式解 · 实现
export interface RidgeResult {
  w: number[];
  b: number;
}
function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length,
    n = B[0]!.length,
    p = B.length;
  const C = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let k = 0; k < p; k++) for (let j = 0; j < n; j++) C[i]![j]! += A[i]![k]! * B[k]![j]!;
  return C;
}
function matVec(A: number[][], v: number[]): number[] {
  return A.map((r) => r.reduce((s, x, j) => s + x * v[j]!, 0));
}
function invert(M: number[][]): number[][] {
  const n = M.length;
  const A = M.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (j === i ? 1 : 0))]);
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let k = i + 1; k < n; k++) if (Math.abs(A[k]![i]!) > Math.abs(A[p]![i]!)) p = k;
    [A[i], A[p]!] = [A[p]!, A[i]!];
    const d = A[i]![i]! || 1;
    for (let j = 0; j < 2 * n; j++) A[i]![j]! /= d;
    for (let k = 0; k < n; k++)
      if (k !== i) {
        const f = A[k]![i]!;
        for (let j = 0; j < 2 * n; j++) A[k]![j]! -= f * A[i]![j]!;
      }
  }
  return A.map((r) => r.slice(n));
}
export function ridgeRegression(X: number[][], y: number[], lambda = 1): RidgeResult {
  const d = X[0]!.length;
  const Xb = X.map((r) => [1, ...r]);
  const Xt = Xb[0]!.map((_, j) => Xb.map((r) => r[j]!));
  const XtX = matMul(Xt, Xb);
  for (let i = 0; i <= d; i++) XtX[i]![i]! += lambda;
  const w = matVec(invert(XtX), matVec(Xt, y));
  return { w: w.slice(1), b: w[0]! };
}
