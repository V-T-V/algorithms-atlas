// =============================================================================
// 睡眠排序 Sleep Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SleepSortHooks {
  /** 为值 v 启动一个「计时器」（用计数模拟，单位为虚拟 tick）。 */
  onStartTimer?: (v: number) => void;
  /** 值 v 的计时结束，被「唤醒」并追加到输出。 */
  onWake?: (v: number, tick: number) => void;
}

/**
 * 睡眠排序（Sleep Sort）。
 *
 * 原理：这是一个**恶搞算法**——为每个元素 `v` 启动一个虚拟计时器，时长正比于 `v`；
 * 计时器到点时把 `v` 追加到输出。由于小值先到点，输出自然升序。
 *
 * 真正的 sleep sort 用操作系统的定时器/线程并发实现；本实现是**确定性模拟**：
 * 在每个 tick，把所有「剩余等待 == 当前 tick」的元素按值升序唤醒，避免依赖真实时钟，
 * 从而可在不阻塞的前提下单测。
 *
 * 仅适用于**正整数**。时间与最大值成正比 `O(max + n)`，**不可用于实际**。
 *
 * @param arr 正整数数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function sleepSort(arr: readonly number[], hooks: SleepSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n === 0) return a;
  if (a.some((v) => v <= 0)) {
    throw new RangeError('sleepSort: only supports positive integers');
  }

  for (const v of a) hooks.onStartTimer?.(v);

  // 按 tick 升序处理；同一 tick 内按值升序输出（稳定）
  const sorted = [...a].sort((x, y) => x - y);
  const out: number[] = [];
  let tick = 0;
  let i = 0;
  while (i < n) {
    const v = sorted[i]!;
    // 跳过空白 tick 直到到达 v 的唤醒时刻
    tick = v;
    // 同一时刻可能多个相同值
    while (i < n && sorted[i] === v) {
      out.push(v);
      hooks.onWake?.(v, tick);
      i++;
    }
  }
  return out;
}
