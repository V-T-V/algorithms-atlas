// 区间调度（最早结束优先）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyEarliestEnd, type GreedyEarliestEndHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly [number, number]> = [
  [1, 3],
  [2, 5],
  [4, 6],
  [6, 7],
  [5, 9],
  [8, 10],
];

export function buildTrace(
  input: ReadonlyArray<readonly [number, number]> = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 个区间`, en: `${input.length} intervals` })
    .setBars(input.map((iv) => ({ value: iv[1] - iv[0], role: 'default' as BarRole })))
    .setAux([{ label: '步骤', value: '将按结束时间排序', role: 'pivot' }])
    .commit();

  const pickedSet = new Set<number>();
  const hooks: GreedyEarliestEndHooks = {
    onPick: (index, interval) => {
      pickedSet.add(index);
      rec
        .begin({
          zh: `选区#${index} [${interval[0]},${interval[1]}]`,
          en: `Pick #${index} [${interval[0]},${interval[1]}]`,
        })
        .setBars(
          input.map((iv, i) => ({
            value: iv[1] - iv[0],
            role: (pickedSet.has(i) ? 'final' : 'default') as BarRole,
          })),
        )
        .setAux([{ label: '已选', value: String(pickedSet.size), role: 'final' }])
        .commit();
    },
    onSkip: (index, interval) => {
      rec
        .begin({
          zh: `跳过#${index} [${interval[0]},${interval[1]}]`,
          en: `Skip #${index} [${interval[0]},${interval[1]}]`,
        })
        .setBars(
          input.map((iv, i) => ({
            value: iv[1] - iv[0],
            role: (pickedSet.has(i) ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };

  const { count } = greedyEarliestEnd(input, hooks);

  rec
    .begin({ zh: `完成：选出 ${count} 个`, en: `Done: picked ${count}` })
    .setBars(
      input.map((iv, i) => ({
        value: iv[1] - iv[0],
        role: (pickedSet.has(i) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '最大不重叠数', value: String(count), role: 'final' }])
    .commit();

  return rec.build();
}
