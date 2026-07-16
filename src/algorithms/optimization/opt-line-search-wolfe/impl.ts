// =============================================================================
// Wolfe 条件线搜索（强 Wolfe，bracketing + zoom）· 纯算法实现
// 参考 Nocedal & Wright 算法 3.5 / 3.6。
// =============================================================================

export type Vec = number[];

export interface WolfeResult {
  alpha: number;
  fnew: number;
  xnew: Vec;
  iterations: number;
  accepted: boolean;
}

export interface WolfeHooks {
  onTrial?: (phase: string, alpha: number, fnew: number, deri: number) => void;
  onResult?: (r: WolfeResult) => void;
}

const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const add = (a: Vec, b: Vec): Vec => a.map((v, i) => v + b[i]!);
const scale = (a: Vec, s: number): Vec => a.map((v) => v * s);

/**
 * 强 Wolfe 线搜索。
 *
 * @param f 目标函数
 * @param grad 梯度
 * @param x 当前点
 * @param fx f(x)
 * @param gx g(x)
 * @param p 下降方向
 * @param options c1、c2、alphaMax、maxIter
 * @param hooks 可选钩子
 */
export function wolfeLineSearch(
  f: (x: Vec) => number,
  grad: (x: Vec) => Vec,
  x: Vec,
  fx: number,
  gx: Vec,
  p: Vec,
  options: { c1?: number; c2?: number; alphaMax?: number; maxIter?: number } = {},
  hooks: WolfeHooks = {},
): WolfeResult {
  const { c1 = 1e-4, c2 = 0.9, alphaMax = 10, maxIter = 40 } = options;
  const phi0 = fx;
  const dphi0 = dot(gx, p); // 应 < 0
  const deriAt = (a: number): { phi: number; dphi: number } => {
    const xa = add(x, scale(p, a));
    return { phi: f(xa), dphi: dot(grad(xa), p) };
  };

  // bracket 阶段
  let alphaPrev = 0;
  let phiPrev = phi0;
  let alpha = 1; // 初始试探
  let alphaLo = 0;
  let alphaHi = alphaMax;
  let inZoom = false;
  let iterations = 0;

  for (let i = 0; i < maxIter; i++) {
    iterations = i + 1;
    const { phi, dphi } = deriAt(alpha);
    hooks.onTrial?.(inZoom ? 'zoom' : 'bracket', alpha, phi, dphi);
    // Armijo 不满足 或 函数值高于 phi0
    if (phi > phi0 + c1 * alpha * dphi0 || (i > 0 && phi >= phiPrev)) {
      alphaLo = alphaPrev;
      alphaHi = alpha;
      inZoom = true;
      break;
    }
    // 曲率满足 → 完成
    if (Math.abs(dphi) <= -c2 * dphi0) {
      const xnew = add(x, scale(p, alpha));
      const result: WolfeResult = { alpha, fnew: phi, xnew, iterations, accepted: true };
      hooks.onResult?.(result);
      return result;
    }
    // 方向导数非负（越过极小）→ 缩进
    if (dphi >= 0) {
      alphaLo = alpha;
      alphaHi = alphaPrev;
      inZoom = true;
      break;
    }
    alphaPrev = alpha;
    phiPrev = phi;
    alpha = Math.min(alpha * 2, alphaMax);
    if (alpha >= alphaMax) break;
  }

  // zoom 阶段（二分）
  for (let i = 0; i < maxIter; i++) {
    iterations++;
    if (alphaHi - alphaLo < 1e-12) break;
    alpha = 0.5 * (alphaLo + alphaHi);
    const { phi, dphi } = deriAt(alpha);
    hooks.onTrial?.('zoom', alpha, phi, dphi);
    const phiLo = deriAt(alphaLo).phi;
    if (phi > phi0 + c1 * alpha * dphi0 || phi >= phiLo) {
      alphaHi = alpha;
    } else {
      if (Math.abs(dphi) <= -c2 * dphi0) {
        const xnew = add(x, scale(p, alpha));
        const result: WolfeResult = { alpha, fnew: phi, xnew, iterations, accepted: true };
        hooks.onResult?.(result);
        return result;
      }
      if (dphi * (alphaHi - alphaLo) >= 0) alphaHi = alphaLo;
      alphaLo = alpha;
    }
  }

  // 兜底：取当前 alpha（可能只满足 Armijo）
  const xnew = add(x, scale(p, alpha));
  const result: WolfeResult = { alpha, fnew: f(xnew), xnew, iterations, accepted: false };
  hooks.onResult?.(result);
  return result;
}
