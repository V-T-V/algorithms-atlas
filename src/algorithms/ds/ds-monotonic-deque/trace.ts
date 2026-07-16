// =============================================================================
// 单调双端队列 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindowMax, type MonotonicDequeHooks } from './impl.ts';

export const DEFAULT_INPUT: { arr: number[]; k: number } = {
  arr: [1, 3, -1, -3, 5, 3, 6, 7],
  k: 3,
};

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;

  rec
    .begin({
      zh: `数组 [${arr.join(',')}] 的滑动窗口(k=${k})最大值`,
      en: `Sliding window(k=${k}) max of [${arr.join(',')}]`,
    })
    .setArray(arr, new Array(arr.length).fill('default'), [])
    .setAux([{ label: 'k', value: String(k), role: 'frontier' }])
    .commit();

  const hooks: MonotonicDequeHooks = {
    onWindow: (start, argmax, value) => {
      const roles: BarRole[] = new Array(arr.length).fill('default');
      for (let i = start; i < start + k && i < arr.length; i++) roles[i] = 'compare';
      roles[argmax] = 'final';
      rec
        .begin({
          zh: `窗口 [${start},${start + k - 1}] 最大 = ${value}（下标 ${argmax}）`,
          en: `Window [${start},${start + k - 1}] max = ${value} (idx ${argmax})`,
        })
        .setArray(arr, roles, [])
        .setAux([{ label: 'max', value: String(value), role: 'final' }])
        .commit();
    },
    onPopBack: (popped) => {
      rec
        .begin({
          zh: `队尾弹出下标 ${popped}（值 ${arr[popped]} 更劣）`,
          en: `Pop back idx ${popped} (worse value ${arr[popped]})`,
        })
        .setAux([{ label: '弹尾', value: String(popped), role: 'warn' }])
        .commit();
    },
  };

  const { values } = slidingWindowMax(arr, k, hooks);
  rec
    .begin({ zh: `结果 = [${values.join(',')}]`, en: `Result = [${values.join(',')}]` })
    .setAux([{ label: '结果', value: `[${values.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
