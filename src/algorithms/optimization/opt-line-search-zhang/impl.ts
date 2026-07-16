// Zhang-Hager 非单调线搜索 · 实现
export interface ZhHooks {
  onIter?: (i: number, x: number, fx: number, ref: number) => void;
  onConclude?: (xmin: number, fmin: number) => void;
}
export function zhangHagerLineSearch(
  f: (x: number) => number,
  grad: (x: number) => number,
  x0: number,
  maxIter = 50,
  eta = 0.1,
  hooks: ZhHooks = {},
): { x: number; fx: number } {
  let x = x0,
    fx = f(x),
    q = 1,
    c = fx;
  for (let it = 0; it < maxIter; it++) {
    const g = grad(x);
    let t = 1;
    let xNew = x - t * g;
    let fNew = f(xNew);
    while (fNew > c - eta * t * g * g && t > 1e-8) {
      t *= 0.5;
      xNew = x - t * g;
      fNew = f(xNew);
    }
    const gamma = 0.5;
    q = gamma * q + 1;
    c = (gamma * q * c + fNew) / q;
    x = xNew;
    fx = fNew;
    hooks.onIter?.(it, x, fx, c);
  }
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
