// =============================================================================
// 辛普森积分 Simpson's Rule · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 复合辛普森法处理单次子区间三元组（两个相邻子区间 [x_{2i-2}, x_{2i-1}, x_{2i}]）。 */
export interface SimpsonPanel {
  /** 三元组的左端点。 */
  a: number;
  /** 三元组的中点。 */
  mid: number;
  /** 三元组的右端点。 */
  b: number;
  /** 步长 h = (b - a) / 2。 */
  h: number;
  /** 三点函数值 f(a), f(mid), f(b)。 */
  fa: number;
  fmid: number;
  fb: number;
  /** 该三元组的辛普森贡献：(h/3)·(fa + 4·fmid + fb)。 */
  contribution: number;
  /** 累计积分值（截至本三元组）。 */
  cumulative: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SimpsonHooks {
  /** 处理完一个三元组子区间。 */
  onPanel?: (panel: SimpsonPanel) => void;
}

/** 辛普森积分返回结果。 */
export interface SimpsonResult {
  /** 积分近似值。 */
  integral: number;
  /** 区间数 n（必须为偶数）。 */
  n: number;
  /** 步长 h = (b - a) / n。 */
  h: number;
  /** 各采样点 x 坐标（n+1 个）。 */
  xs: number[];
  /** 各采样点函数值（n+1 个）。 */
  fs: number[];
}

/**
 * 复合辛普森积分（Simpson's 1/3 rule）。
 *
 * 将区间 `[a, b]` 分成 `n`（偶数）个等长子区间，在每两个相邻子区间构成的三元组上
 * 用二次抛物线逼近被积函数，积分贡献为：
 *
 *   `(h/3) · (f(x_{2i-2}) + 4·f(x_{2i-1}) + f(x_{2i}))`
 *
 * 全部三元组求和后，总公式为：
 *
 *   `(h/3) · (f_0 + 4·(f_1+f_3+...) + 2·(f_2+f_4+...) + f_n)`
 *
 * 代数精度为 3（对不超过 3 次的多项式精确成立），整体误差 `O(h⁴)`。
 * 若 n 为奇数则自动减一取偶数。要求 n ≥ 2。
 *
 * @param f 被积函数
 * @param a 左端点
 * @param b 右端点
 * @param n 子区间数（偶数；若为奇数则自动取 n-1）
 * @param hooks 可选的事件钩子
 */
export function simpsonIntegral(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  hooks: SimpsonHooks = {},
): SimpsonResult {
  if (n < 2) n = 2;
  if (n % 2 === 1) n -= 1; // 强制偶数
  const h = (b - a) / n;
  const xs: number[] = new Array(n + 1);
  const fs: number[] = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    xs[i] = x;
    fs[i] = f(x);
  }

  // 加权系数：奇数下标 4，偶数（非端点）下标 2
  let total = fs[0]! + fs[n]!;
  let cumulative = 0;
  for (let i = 1; i < n; i++) {
    total += (i % 2 === 1 ? 4 : 2) * fs[i]!;
  }
  // 逐个三元组报告累计值
  for (let k = 1; k <= n / 2; k++) {
    const il = 2 * k - 2;
    const im = 2 * k - 1;
    const ir = 2 * k;
    const subA = xs[il]!;
    const subMid = xs[im]!;
    const subB = xs[ir]!;
    const contribution = (h / 3) * (fs[il]! + 4 * fs[im]! + fs[ir]!);
    cumulative += contribution;
    hooks.onPanel?.({
      a: subA,
      mid: subMid,
      b: subB,
      h,
      fa: fs[il]!,
      fmid: fs[im]!,
      fb: fs[ir]!,
      contribution,
      cumulative,
    });
  }

  const integral = (h / 3) * total;
  return { integral, n, h, xs, fs };
}
