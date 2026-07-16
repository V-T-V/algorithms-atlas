// =============================================================================
// 区间置位（Set Bits in Range）· 纯算法实现
// 把 value 的 [lo, hi] 位区间（含两端，bit0=LSB）全部置 1。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SetBitsRangeHooks {
  /** 计算出区间全 1 掩码（已左移到目标位置）。 */
  onMask?: (shiftedMask: number) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/**
 * 把 value 的 [lo, hi] 位区间全部置 1。
 *
 * @param value 原始非负整数
 * @param lo 起始位（含，bit0 = LSB）
 * @param hi 结束位（含）
 * @param hooks 可选的事件钩子
 * @returns 处理后的非负整数
 */
export function setBitsRange(
  value: number,
  lo: number,
  hi: number,
  hooks: SetBitsRangeHooks = {},
): number {
  if (value < 0) throw new RangeError(`value 须非负，收到 ${value}`);
  if (!Number.isInteger(lo) || !Number.isInteger(hi)) {
    throw new TypeError(`lo/hi 须为整数，收到 lo=${lo}, hi=${hi}`);
  }
  if (lo < 0) throw new RangeError(`lo 须 >= 0，收到 ${lo}`);
  if (hi < lo) throw new RangeError(`hi(${hi}) 须 >= lo(${lo})`);
  // 防止 1 << 31 等出现有符号溢出，限制 30 位以内为安全区
  if (hi > 30) throw new RangeError(`hi 须 <= 30（避免 32 位有符号溢出），收到 ${hi}`);

  const len = hi - lo + 1;
  const mask = ((1 << len) - 1) << lo;
  hooks.onMask?.(mask >>> 0);
  const result = (value | mask) >>> 0;
  hooks.onDone?.(result);
  return result;
}

/** 把非负整数格式化为定宽二进制字符串。 */
export function toBinaryString(n: number, width: number): string {
  let s = '';
  let x = n >>> 0;
  for (let i = 0; i < width; i++) {
    s = (x & 1) + s;
    x = x >>> 1;
  }
  return s;
}
