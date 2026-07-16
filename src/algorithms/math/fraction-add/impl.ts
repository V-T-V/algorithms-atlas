// =============================================================================
// 分数加法 Fraction Add · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一个分数 p/q（q > 0）。 */
export interface Frac {
  num: bigint;
  den: bigint;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FractionAddHooks {
  /** 把两个分数通分相加，得到未化简的中间结果 [sumNum, sumDen]。 */
  onAdd?: (acc: Frac, term: Frac, sumNum: bigint, sumDen: bigint) => void;
  /** 化简后累加结果。 */
  onReduced?: (acc: Frac) => void;
  /** 最终结果。 */
  onResult?: (result: Frac) => void;
}

/**
 * 多个分数求和（精确，BigInt 分数运算）。
 *
 * 原理：对每个分数 `p/q`，累加器 `acc = accNum/accDen` 更新为
 * `acc + p/q = (accNum·q + p·accDen) / (accDen·q)`，再**约分**（除以 gcd、归一符号）。
 * 每步约分避免分子分母膨胀。
 *
 * - 时间 `O(m · log(max))`（m 个分数，约分用欧几里得）
 * - 空间 `O(1)`
 *
 * @param fracs 分数数组，每项 `[numerator, denominator]`（denominator ≠ 0）
 * @param hooks 可选的事件钩子
 * @returns 和 `[num, den]`（既约，den > 0）
 */
export function fractionAdd(
  fracs: ReadonlyArray<[number, number]>,
  hooks: FractionAddHooks = {},
): [bigint, bigint] {
  let accNum = 0n;
  let accDen = 1n;

  for (const [pn, qn] of fracs) {
    if (qn === 0) throw new RangeError('fractionAdd: denominator must be non-zero');
    const p = BigInt(pn);
    const q = BigInt(qn);
    const sumNum = accNum * q + p * accDen;
    const sumDen = accDen * q;
    hooks.onAdd?.({ num: accNum, den: accDen }, { num: p, den: q }, sumNum, sumDen);
    const g = gcdAbs(sumNum, sumDen);
    const gg = g === 0n ? 1n : g;
    let n = sumNum / gg;
    let d = sumDen / gg;
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    accNum = n;
    accDen = d;
    hooks.onReduced?.({ num: accNum, den: accDen });
  }
  hooks.onResult?.({ num: accNum, den: accDen });
  return [accNum, accDen];
}

function gcdAbs(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}
