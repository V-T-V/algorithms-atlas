// =============================================================================
// 睡眠排序 · 录制帧序列
// 通过 sleepSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sleepSort, type SleepSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
      .commit();
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` });

  const hooks: SleepSortHooks = {
    onStartTimer: (v) => {
      // 启动计时器（不单独成帧，避免帧数爆炸）
      void v;
    },
    onWake: (v, tick) => {
      out.push(v);
      snapshot({
        zh: `tick ${tick}：值 ${v} 被唤醒`,
        en: `tick ${tick}: value ${v} wakes up`,
      });
    },
  };

  sleepSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
