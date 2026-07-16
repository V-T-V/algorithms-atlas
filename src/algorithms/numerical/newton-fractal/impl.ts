// =============================================================================
// 牛顿分形（Newton Fractal）· 纯算法实现
// 对 f(z) = z^d − 1 求 d 次单位根，按收敛根与迭代次数分类。
// =============================================================================

export interface Complex {
  re: number;
  im: number;
}

export interface NewtonPoint {
  /** 收敛到的根编号（0-based），未收敛为 -1。 */
  rootIndex: number;
  /** 迭代次数。 */
  iterations: number;
  /** 是否收敛。 */
  converged: boolean;
}

export interface NewtonFractalHooks {
  /** 完成一个网格点。 */
  onPoint?: (i: number, j: number, result: NewtonPoint) => void;
  /** 完成整个网格。 */
  onDone?: (grid: NewtonPoint[][]) => void;
}

const cAbs = (c: Complex): number => Math.hypot(c.re, c.im);
const cDiv = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};

/**
 * 牛顿法求 f(z) = z^degree − 1 的根。
 * @param z0 起始点
 * @param degree 多项式次数（根为 1 的 degree 次单位根）
 * @param roots 预计算的根列表（用于归类）
 * @param maxIter 最大迭代次数
 * @param eps 收敛阈值 |f(z)| < eps
 */
export function newtonIterate(
  z0: Complex,
  degree: number,
  roots: readonly Complex[],
  maxIter = 50,
  eps = 1e-6,
): NewtonPoint {
  let z = { ...z0 };
  for (let iter = 0; iter < maxIter; iter++) {
    // f(z) = z^d − 1, f'(z) = d·z^(d-1)
    // z^{d} via repeated multiply
    let zd: Complex = { re: 1, im: 0 };
    for (let k = 0; k < degree; k++) zd = mul(zd, z);
    const f = { re: zd.re - 1, im: zd.im };
    if (cAbs(f) < eps) {
      // 归类到最近根
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let r = 0; r < roots.length; r++) {
        const d = cAbs({ re: z.re - roots[r]!.re, im: z.im - roots[r]!.im });
        if (d < bestDist) {
          bestDist = d;
          bestIdx = r;
        }
      }
      return { rootIndex: bestIdx, iterations: iter, converged: true };
    }
    let zd1: Complex = { re: 1, im: 0 }; // z^(d-1)
    for (let k = 0; k < degree - 1; k++) zd1 = mul(zd1, z);
    const fp = { re: degree * zd1.re, im: degree * zd1.im };
    // z ← z − f/f'
    const step = cDiv(f, fp);
    z = { re: z.re - step.re, im: z.im - step.im };
  }
  return { rootIndex: -1, iterations: maxIter, converged: false };
}

function mul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

/** 预计算 z^degree − 1 的所有单位根。 */
export function unitRoots(degree: number): Complex[] {
  const out: Complex[] = [];
  for (let k = 0; k < degree; k++) {
    const angle = (2 * Math.PI * k) / degree;
    out.push({ re: Math.cos(angle), im: Math.sin(angle) });
  }
  return out;
}

/**
 * 在 [reMin,reMax]×[imMin,imMax] 的 W×H 网格上计算牛顿分形。
 */
export function newtonFractal(
  degree: number,
  reMin: number,
  reMax: number,
  imMin: number,
  imMax: number,
  width: number,
  height: number,
  hooks: NewtonFractalHooks = {},
): NewtonPoint[][] {
  if (degree < 1) throw new RangeError(`degree 须 >= 1，收到 ${degree}`);
  if (width < 1 || height < 1) throw new RangeError(`width/height 须 >= 1`);
  const roots = unitRoots(degree);
  const grid: NewtonPoint[][] = [];
  for (let j = 0; j < height; j++) {
    const row: NewtonPoint[] = [];
    const im = imMin + ((imMax - imMin) * j) / Math.max(1, height - 1);
    for (let i = 0; i < width; i++) {
      const re = reMin + ((reMax - reMin) * i) / Math.max(1, width - 1);
      const result = newtonIterate({ re, im }, degree, roots);
      row.push(result);
      hooks.onPoint?.(i, j, result);
    }
    grid.push(row);
  }
  hooks.onDone?.(grid);
  return grid;
}
