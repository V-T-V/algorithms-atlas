// 合并区间 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMergeIntervals, type GreedyMergeIntervalsHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly [number, number]> = [
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
];

export function buildTrace(
  input: ReadonlyArray<readonly [number, number]> = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 个区间`, en: `${input.length} intervals` })
    .setBars(input.map((iv) => ({ value: iv[1] - iv[0], role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMergeIntervalsHooks = {
    onMerge: (into) => {
      rec
        .begin({ zh: `合并 → [${into[0]},${into[1]}]`, en: `Merge → [${into[0]},${into[1]}]` })
        .setBars([{ value: into[1] - into[0], role: 'final' as BarRole }])
        .commit();
    },
    onNew: (interval) => {
      rec
        .begin({
          zh: `新区间 [${interval[0]},${interval[1]}]`,
          en: `New [${interval[0]},${interval[1]}]`,
        })
        .setBars([{ value: interval[1] - interval[0], role: 'compare' as BarRole }])
        .commit();
    },
  };

  const result = greedyMergeIntervals(input, hooks);

  rec
    .begin({
      zh: `完成：${result.length} 个区间`,
      en: `Done: ${result.length} intervals`,
    })
    .setBars(result.map((iv) => ({ value: iv[1] - iv[0], role: 'final' as BarRole })))
    .setAux([
      { label: '结果', value: result.map((iv) => `[${iv[0]},${iv[1]}]`).join(' '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
