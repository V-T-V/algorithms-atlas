export interface CasHooks {
  onAttempt?: (i: number, expected: number, neu: number) => void;
  onSuccess?: (val: number, attempts: number) => void;
}
export function casLoop(
  initial: number,
  compute: (cur: number) => number,
  contenders: number[],
  hooks: CasHooks = {},
): { val: number; attempts: number } {
  let val = initial;
  let attempts = 0;
  let ci = 0;
  while (true) {
    const expected = val;
    const neu = compute(expected);
    hooks.onAttempt?.(attempts, expected, neu);
    attempts++;
    // 模拟竞争：偶数次失败
    if (contenders[ci % contenders.length]! % 2 === 1 && attempts < 3) {
      val = expected + contenders[ci % contenders.length]!;
      ci++;
    } else {
      val = neu;
      hooks.onSuccess?.(val, attempts);
      break;
    }
  }
  return { val, attempts };
}
