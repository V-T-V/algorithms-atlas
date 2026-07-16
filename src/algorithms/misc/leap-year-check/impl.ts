// =============================================================================
// 闰年判定 · 纯算法实现
// year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)。零 DOM 依赖。
// =============================================================================

/** 事件钩子。 */
export interface LeapYearHooks {
  /** 三步判定完成后给出结论。 */
  onCheck?: (year: number, by4: boolean, by100: boolean, by400: boolean, isLeap: boolean) => void;
}

/**
 * 判定 year 是否为闰年（格里高利历）。
 */
export function isLeapYear(year: number, hooks: LeapYearHooks = {}): boolean {
  if (!Number.isInteger(year)) {
    throw new RangeError('year must be an integer');
  }
  const by4 = year % 4 === 0;
  const by100 = year % 100 === 0;
  const by400 = year % 400 === 0;
  const isLeap = by4 && (!by100 || by400);
  hooks.onCheck?.(year, by4, by100, by400, isLeap);
  return isLeap;
}

/** 批量判定区间内所有闰年。 */
export function leapYearsIn(from: number, to: number): number[] {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from > to) {
    throw new RangeError('from/to must be integers with from <= to');
  }
  const out: number[] = [];
  for (let y = from; y <= to; y++) {
    if (isLeapYear(y)) out.push(y);
  }
  return out;
}
