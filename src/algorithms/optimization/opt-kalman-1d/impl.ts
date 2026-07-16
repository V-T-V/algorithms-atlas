// 一维卡尔曼滤波 · 实现
export interface KfHooks {
  onStep?: (i: number, z: number, x: number, P: number) => void;
  onConclude?: (estimates: number[]) => void;
}
export function kalman1d(
  measurements: readonly number[],
  x0: number,
  P0: number,
  Q: number,
  R: number,
  hooks: KfHooks = {},
): number[] {
  let x = x0,
    P = P0;
  const est: number[] = [];
  for (let i = 0; i < measurements.length; i++) {
    P += Q;
    const K = P / (P + R);
    x = x + K * (measurements[i]! - x);
    P = (1 - K) * P;
    est.push(x);
    hooks.onStep?.(i, measurements[i]!, x, P);
  }
  hooks.onConclude?.(est);
  return est;
}
