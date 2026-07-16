// 无重叠区间 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyNonOverlapping, type GreedyNonOverlappingHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly [number, number]> = [
  [1, 2],
  [2, 3],
  [3, 4],
  [1, 3],
];

export function buildTrace(
  input: ReadonlyArray<readonly [number, number]> = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 个区间`, en: `${input.length} intervals` })
    .setBars(input.map((iv) => ({ value: iv[1], role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyNonOverlappingHooks = {
    onKeep: (index) => {
      rec
        .begin({ zh: `保留区间 ${index}`, en: `Keep interval ${index}` })
        .setBars([{ value: index, role: 'final' as BarRole }])
        .commit();
    },
    onRemove: (index) => {
      rec
        .begin({ zh: `删除区间 ${index}`, en: `Remove interval ${index}` })
        .setBars([{ value: index, role: 'warn' as BarRole }])
        .commit();
    },
  };

  const result = greedyNonOverlapping(input, hooks);

  rec
    .begin({ zh: `完成：删除 ${result} 个`, en: `Done: removed ${result}` })
    .setAux([{ label: '删除数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
