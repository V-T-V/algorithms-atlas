// Boyer-Moore 多数投票 · 纯算法实现

/** 事件钩子。 */
export interface MooreVotingHooks {
  /** 处理元素 a[i]：当前候选 candidate、计数 count。 */
  onStep?: (
    i: number,
    value: number,
    candidate: number,
    count: number,
    action: 'same' | 'diff' | 'swap',
  ) => void;
  /** 第一轮结束，给出候选。 */
  onCandidate?: (candidate: number) => void;
  /** 验证阶段：实际频数 actualCount。 */
  onVerify?: (candidate: number, actualCount: number, n: number) => void;
  /** 最终结论。 */
  onResult?: (majority: number | null) => void;
}

export interface MajorityResult {
  /** 多数元素（出现 > n/2 次）；不存在时为 null。 */
  majority: number | null;
  /** 第一轮候选（即便不是真正多数）。 */
  candidate: number;
}

/**
 * Boyer-Moore 多数投票：找出现次数 > n/2 的元素。
 * @param arr 非空数组
 * @param requireVerify 是否进行第二轮验证（默认 true）
 */
export function mooreVoting(
  arr: readonly number[],
  hooks: MooreVotingHooks = {},
  requireVerify = true,
): MajorityResult {
  if (arr.length === 0) {
    hooks.onResult?.(null);
    return { majority: null, candidate: NaN };
  }

  // 第一轮：找候选
  let candidate = arr[0]!;
  let count = 1;
  for (let i = 1; i < arr.length; i++) {
    const v = arr[i]!;
    if (count === 0) {
      candidate = v;
      count = 1;
      hooks.onStep?.(i, v, candidate, count, 'swap');
    } else if (v === candidate) {
      count++;
      hooks.onStep?.(i, v, candidate, count, 'same');
    } else {
      count--;
      hooks.onStep?.(i, v, candidate, count, 'diff');
    }
  }
  hooks.onCandidate?.(candidate);

  // 第二轮：验证
  if (requireVerify) {
    let actual = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === candidate) actual++;
    }
    hooks.onVerify?.(candidate, actual, arr.length);
    if (actual > Math.floor(arr.length / 2)) {
      hooks.onResult?.(candidate);
      return { majority: candidate, candidate };
    }
    hooks.onResult?.(null);
    return { majority: null, candidate };
  }

  // 不验证：假定存在多数
  hooks.onResult?.(candidate);
  return { majority: candidate, candidate };
}
