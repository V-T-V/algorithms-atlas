// 众数频率变种 · 实现

export interface MfResult {
  mode: number | null; // 哈希频率众数
  modeFreq: number;
  majority: number | null; // BM 多数（>n/2），可能不存在
}

export interface MfHooks {
  onVote?: (candidate: number, count: number) => void;
  onFreq?: (freq: Map<number, number>) => void;
}

/** Boyer-Moore 多数投票候选 + 频率众数。 */
export function modeFrequency(arr: readonly number[], hooks: MfHooks = {}): MfResult {
  if (arr.length === 0) return { mode: null, modeFreq: 0, majority: null };

  // Boyer-Moore 找多数候选
  let candidate = arr[0]!;
  let count = 1;
  for (let i = 1; i < arr.length; i++) {
    if (count === 0) {
      candidate = arr[i]!;
      count = 1;
    } else if (arr[i] === candidate) {
      count++;
    } else {
      count--;
    }
    hooks.onVote?.(candidate, count);
  }
  // 验证 candidate 是否真为多数
  const candCount = arr.filter((x) => x === candidate).length;
  const majority = candCount > arr.length / 2 ? candidate : null;

  // 频率众数
  const freq = new Map<number, number>();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);
  hooks.onFreq?.(freq);
  let mode = arr[0]!;
  let modeFreq = 0;
  for (const [v, c] of freq) {
    if (c > modeFreq) {
      modeFreq = c;
      mode = v;
    }
  }
  return { mode, modeFreq, majority };
}
