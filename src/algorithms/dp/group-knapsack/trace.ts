// 分组背包 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { groupKnapsack, type GKItem } from './impl.ts';

export const DEFAULT_INPUT: GKItem[][] = [
  [
    { weight: 1, value: 5 },
    { weight: 2, value: 8 },
  ],
  [
    { weight: 1, value: 1 },
    { weight: 2, value: 9 },
  ],
  [
    { weight: 1, value: 3 },
    { weight: 2, value: 7 },
    { weight: 4, value: 4 },
    { weight: 6, value: 6 },
  ],
];

const CAPACITY = 4;

/** 录制演示帧序列。 */
export function buildTrace(input: GKItem[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const flatValues = input.flatMap((g) => g.map((it) => it.value));
  rec
    .begin({ zh: `初始分组：${flatValues.join(', ')}`, en: `Initial: ${flatValues.join(', ')}` })
    .setBars(rec.barsFrom(flatValues))
    .commit();

  // TODO: 在调用算法的过程中，于关键步骤 rec.begin(...).setBars(...).commit()
  const out = groupKnapsack(input, CAPACITY);
  rec
    .begin({ zh: `完成，最大价值 = ${out}`, en: `Done, max value = ${out}` })
    .setBars(rec.barsFrom(flatValues))
    .setAux([{ label: '最大价值', value: String(out), role: 'final' }])
    .commit();

  return rec.build();
}
