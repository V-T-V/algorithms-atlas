// 插入区间 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyInsertInterval, type GreedyInsertIntervalHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  intervals: [
    [1, 3],
    [6, 9],
  ] as ReadonlyArray<readonly [number, number]>,
  newInterval: [2, 5] as readonly [number, number],
};

export function buildTrace(
  input: {
    intervals: ReadonlyArray<readonly [number, number]>;
    newInterval: readonly [number, number];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { intervals, newInterval } = input;

  rec
    .begin({
      zh: `插入 [${newInterval[0]},${newInterval[1]}]`,
      en: `Insert [${newInterval[0]},${newInterval[1]}]`,
    })
    .setBars(intervals.map((iv) => ({ value: iv[1] - iv[0], role: 'default' as BarRole })))
    .setAux([{ label: 'new', value: `[${newInterval[0]},${newInterval[1]}]`, role: 'pivot' }])
    .commit();

  const hooks: GreedyInsertIntervalHooks = {
    onMerge: (cur) => {
      rec
        .begin({ zh: `合并 → [${cur[0]},${cur[1]}]`, en: `Merge → [${cur[0]},${cur[1]}]` })
        .setBars([{ value: cur[1] - cur[0], role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = greedyInsertInterval(intervals, newInterval, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个区间`, en: `Done: ${result.length} intervals` })
    .setBars(result.map((iv) => ({ value: iv[1] - iv[0], role: 'final' as BarRole })))
    .setAux([
      { label: '结果', value: result.map((iv) => `[${iv[0]},${iv[1]}]`).join(' '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
