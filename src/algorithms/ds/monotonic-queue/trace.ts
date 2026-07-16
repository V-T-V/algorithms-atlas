// =============================================================================
// 单调队列 · 录制帧序列
// 用 setBars 展示原数组，role: 窗口最大='pivot'，窗口内='frontier'，
// 当前入队='compare'，被淘汰='warn'，已确定最大='final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindowMax, type MonotonicQueueHooks } from './impl.ts';

export const DEFAULT_INPUT = { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 };

/** 录制演示帧序列。 */
export function buildTrace(input: { nums: readonly number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { nums, k } = input;

  let inWindow = new Set<number>(); // 当前窗口内的下标
  const inDeque = new Set<number>(); // 单调队列中的下标
  let maxIdx = -1; // 当前窗口最大值下标
  let current = -1; // 当前入队的下标
  let removed = -1; // 当前帧刚被淘汰/过期的下标
  const maxima: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    inWindow.forEach((i) => (roles[i] = 'frontier'));
    if (removed >= 0) roles[removed] = 'warn';
    if (current >= 0 && roles[current] === undefined) roles[current] = 'compare';
    inDeque.forEach((i) => (roles[i] = 'pivot'));
    if (maxIdx >= 0) roles[maxIdx] = 'pivot';
    const dqDesc =
      '队列(大→小): [' +
      Array.from(inDeque)
        .sort((a, b) => b - a)
        .join(', ') +
      ']';
    rec
      .begin(note)
      .setBars(rec.barsFrom(nums, roles))
      .setAux([
        {
          label: '窗口',
          value: `[${maxIdx >= 0 ? maxIdx - k + 1 : 0}, ${maxIdx >= 0 ? maxIdx : 0}]`,
          role: 'frontier',
        },
        { label: '队列', value: dqDesc, role: 'pivot' },
      ])
      .commit();
    current = -1;
    removed = -1;
  };

  snapshot({
    zh: `数组：[${nums.join(', ')}]，窗口 k = ${k}`,
    en: `Array: [${nums.join(', ')}], window k = ${k}`,
  });

  const hooks: MonotonicQueueHooks = {
    onCompare: (i) => {
      current = i;
    },
    onPopBack: (tailIdx, curVal) => {
      inDeque.delete(tailIdx);
      removed = tailIdx;
      current = -1;
      snapshot({
        zh: `队尾 ${tailIdx}（值 ${nums[tailIdx]}）≤ 当前 ${curVal} → 淘汰`,
        en: `Tail ${tailIdx} (val ${nums[tailIdx]}) ≤ current ${curVal} → evict`,
      });
    },
    onPushBack: (i) => {
      inDeque.add(i);
      current = i;
      // 暂不快照；窗口满后再统一快照
    },
    onPopFront: (frontIdx) => {
      inDeque.delete(frontIdx);
      removed = frontIdx;
      snapshot({
        zh: `队首 ${frontIdx} 滑出窗口 → 移除`,
        en: `Front ${frontIdx} slid out of window → remove`,
      });
    },
    onWindowMax: (lo, hi, mi) => {
      inWindow = new Set<number>();
      for (let j = lo; j <= hi; j++) inWindow.add(j);
      maxIdx = mi;
      maxima.push(nums[mi]!);
      snapshot({
        zh: `窗口 [${lo}, ${hi}] 最大值 = ${nums[mi]}（下标 ${mi}）`,
        en: `Window [${lo}, ${hi}] max = ${nums[mi]} (idx ${mi})`,
      });
      maxIdx = -1;
    },
  };

  slidingWindowMax(nums, k, hooks);

  // 终态：标记所有最大值
  rec
    .begin({
      zh: `完成；各窗口最大值：[${maxima.join(', ')}]`,
      en: `Done; window maxima: [${maxima.join(', ')}]`,
    })
    .setBars(maxima.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
