// =============================================================================
// 并行位计数（Parallel Population Count / SWAR）· 纯算法实现
// 通过 SWAR 在常数步内统计 32 位整数中 1 的个数。
// =============================================================================

/** 执行过程中各 SWAR 阶段的状态，供录制器可视化。 */
export interface ParallelPopcountHooks {
  /** 每完成一个阶段后调用（阶段名 + 当前 x 的值）。 */
  onStage?: (stage: string, x: number) => void;
}

/**
 * 并行（SWAR）位计数：统计 32 位无符号整数 x 中 1 的个数。
 *
 * 关键技巧：每一步把相邻 k 位的计数「折叠」合并成 2k 位的计数，
 * 最终乘以 0x01010101 把 4 个字节里的计数累加到最高字节。
 *
 * 仅对 32 位无符号整数有效（x 被视为 >>>0）。复杂度 O(1)。
 *
 * @param x 非负整数（0 ≤ x < 2^32）
 * @param hooks 可选的事件钩子
 * @returns 1 的个数（0..32）
 */
export function popcountParallel(x: number, hooks: ParallelPopcountHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`popcountParallel 要求 32 位无符号整数，收到 ${x}`);
  }
  // 视为 32 位无符号
  let n = x >>> 0;
  hooks.onStage?.('input', n);

  // 步骤 1：每 2 位一组计数
  n = n - ((n >>> 1) & 0x55555555);
  hooks.onStage?.('pair (2-bit)', n);

  // 步骤 2：每 4 位一组计数
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  hooks.onStage?.('nibble (4-bit)', n);

  // 步骤 3：每 8 位一组计数
  n = (n + (n >>> 4)) & 0x0f0f0f0f;
  hooks.onStage?.('byte (8-bit)', n);

  // 步骤 4：乘 0x01010101 累加 4 个字节到最高字节，再右移 24 位
  const acc = (n * 0x01010101) >>> 0;
  hooks.onStage?.('accumulate (×0x01010101)', acc);

  const result = acc >>> 24;
  hooks.onStage?.('result (>>>24)', result);
  return result;
}
