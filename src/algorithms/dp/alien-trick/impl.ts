// =============================================================================
// wqs 二分（Alien Trick / Aliens Trick）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典应用：在「恰好选 k 个元素」的最大权值和问题上，用二分一个罚值 λ，
//   把「带个数约束的最优化」转化为「无个数约束 + 计个数」的判定问题。
// =============================================================================

/** 一次判定（lambda）的结果：最大权值与对应选取个数。 */
export interface AlienDecide {
  lambda: number;
  best: number;
  count: number; // 该解选取的元素个数
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AlienTrickHooks {
  /** 进入一次罚值 λ 的判定。 */
  onProbe?: (lambda: number, lo: number, hi: number) => void;
  /** 判定完成：给出在该 λ 下贪心选择的最优权值 best 与个数 count。 */
  onDecide?: (res: AlienDecide) => void;
  /** 二分边界收缩：新的 [lo, hi]。 */
  onNarrow?: (lo: number, hi: number) => void;
}

/**
 * 单次判定：每选取一个元素付出 λ 代价时，无个数约束的最大权值和及对应个数。
 * 取法：仅选正收益（value - λ > 0）的元素。
 */
function decide(values: readonly number[], lambda: number): { best: number; count: number } {
  let best = 0;
  let count = 0;
  for (const x of values) {
    const gain = x - lambda;
    if (gain > 0) {
      best += gain;
      count++;
    }
  }
  return { best, count };
}

/**
 * Alien Trick：在数组中选**恰好 k 个**元素使权值和最大（元素可任意位置）。
 *
 * 思路：二分罚值 λ。对每个 λ，贪心地选所有 `value - λ > 0` 的元素，
 * 同时记录个数。若个数 ≥ k，说明 λ 偏小（应加大罚值减少个数）。
 * 最终答案 = `best(λ*) + k·λ*`（补回罚值）。
 *
 * @param values 数值数组（可正可负）
 * @param k 要求恰好选取的元素个数（>=0）
 * @param hooks 可选事件钩子
 * @returns 恰好 k 个时的最大权值和。
 */
export function alienTrick(
  values: readonly number[],
  k: number,
  hooks: AlienTrickHooks = {},
): number {
  const n = values.length;
  if (k <= 0) return 0;
  if (k > n) k = n;

  // 特例：k == n，必须全选
  if (k === n) return values.reduce((s, x) => s + x, 0);

  let lo = -1_000_000_001;
  let hi = 1_000_000_001;
  let answer = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(mid, lo, hi);
    const { best, count } = decide(values, mid);
    hooks.onDecide?.({ lambda: mid, best, count });
    if (count >= k) {
      // 选取个数足够：λ 可继续增大；真实价值 = 罚值前的总价值
      answer = best + k * mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
    hooks.onNarrow?.(lo, hi);
  }
  return answer;
}
