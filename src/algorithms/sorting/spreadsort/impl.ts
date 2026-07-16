// =============================================================================
// Spread 排序（Spreadsort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SpreadsortHooks {
  /** 在某一段上选定桶数与移位参数。 */
  onBin?: (bucketCount: number, shift: number) => void;
  /** 完成一次分桶，给出每桶元素数。 */
  onDistribute?: (sizes: number[]) => void;
  /** 进入插入排序收尾阶段。 */
  onInsertion?: (lo: number, hi: number) => void;
}

const INSERTION_THRESHOLD = 16;

/** 对 a[lo..hi] 做原地插入排序（含两端）。 */
function _insertionSort(a: number[], lo: number, hi: number): void {
  for (let i = lo + 1; i <= hi; i++) {
    const key = a[i]!;
    let j = i - 1;
    while (j >= lo && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = key;
  }
}

/**
 * Spread 排序（整数版，简化）。
 *
 * 对每一段 [lo,hi] 计算 min/max，用若干高位把元素分到固定数量（这里 256）个桶；
 * 桶过小则插入排序，否则递归。仅支持 32 位安全整数。
 *
 * @param arr 待排序整数数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function spreadsort(arr: readonly number[], hooks: SpreadsortHooks = {}): number[] {
  const a = [...arr];

  // 校验：仅支持 32 位整数
  for (const v of a) {
    if (!Number.isInteger(v) || v < -2147483648 || v > 2147483647) {
      throw new RangeError(`spreadsort 仅支持 32 位整数，收到 ${v}`);
    }
  }

  const n = a.length;
  if (n <= 1) return a;

  // 转无符号 32 位处理更方便：偏移 +2^31 使所有值非负
  const toU = (v: number): number => v + 2147483648;
  const fromU = (u: number): number => u - 2147483648;

  // 把 a[lo..hi] 用无符号值覆盖
  const au = a.map(toU);

  const recurse = (lo: number, hi: number): void => {
    if (hi - lo + 1 <= INSERTION_THRESHOLD) {
      hooks.onInsertion?.(lo, hi);
      // 在 au 上做插入排序
      for (let i = lo + 1; i <= hi; i++) {
        const key = au[i]!;
        let j = i - 1;
        while (j >= lo && au[j]! > key) {
          au[j + 1] = au[j]!;
          j--;
        }
        au[j + 1] = key;
      }
      return;
    }
    let umin = au[lo]!;
    let umax = au[lo]!;
    for (let i = lo + 1; i <= hi; i++) {
      const v = au[i]!;
      if (v < umin) umin = v;
      if (v > umax) umax = v;
    }
    if (umin === umax) return; // 段内全等

    // 桶数：基于范围选 8 位（256 桶）或更少
    const range = umax - umin; // ≥1
    let bits = 8;
    // 当范围很小时减少位数，避免空桶过多
    while (bits > 1 && 1 << bits > range + 1) bits--;
    const bucketCount = 1 << bits;
    const shift = Math.max(0, Math.floor(Math.log2(range + 1)) - bits);
    const divisor = 1 << shift;
    const bucketOf = (u: number): number =>
      Math.min(bucketCount - 1, Math.floor((u - umin) / divisor));
    hooks.onBin?.(bucketCount, shift);

    // 计数 + 前缀和
    const count = new Array<number>(bucketCount).fill(0);
    for (let i = lo; i <= hi; i++) count[bucketOf(au[i]!)]!++;
    const start = new Array<number>(bucketCount + 1).fill(0);
    for (let b = 0; b < bucketCount; b++) start[b + 1] = start[b]! + count[b]!;
    hooks.onDistribute?.(count.slice());

    // 美式旗子分配（American flag）原地分发
    const out = new Array<number>(hi - lo + 1);
    const cursor = [...start];
    for (let i = lo; i <= hi; i++) {
      const b = bucketOf(au[i]!);
      out[cursor[b]! - start[0]!] = au[i]!;
      cursor[b] = cursor[b]! + 1;
    }
    for (let i = 0; i < out.length; i++) au[lo + i] = out[i]!;

    // 递归每个非空桶
    for (let b = 0; b < bucketCount; b++) {
      const bLo = lo + start[b]!;
      const bHi = lo + start[b + 1]! - 1;
      if (bLo < bHi) recurse(bLo, bHi);
    }
  };

  recurse(0, n - 1);

  // 转回有符号
  for (let i = 0; i < n; i++) a[i] = fromU(au[i]!);
  return a;
}
