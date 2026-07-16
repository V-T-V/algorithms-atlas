// 最大重叠区间 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxIntersection, type GreedyMaxIntersectionHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly [number, number]> = [
  [1, 5],
  [2, 6],
  [3, 8],
  [4, 7],
];

export function buildTrace(
  input: ReadonlyArray<readonly [number, number]> = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 个区间`, en: `${input.length} intervals` })
    .setBars(input.map((iv) => ({ value: iv[1] - iv[0], role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMaxIntersectionHooks = {
    onEvent: (pos, delta, current) => {
      rec
        .begin({
          zh: `${pos} 处 ${delta > 0 ? '进入' : '离开'}，当前 ${current}`,
          en: `At ${pos} ${delta > 0 ? 'enter' : 'leave'}, current ${current}`,
        })
        .setAux([{ label: '当前覆盖', value: String(current), role: 'compare' }])
        .commit();
    },
    onMax: (pos, maxCount) => {
      rec
        .begin({ zh: `新最大 ${maxCount} @ ${pos}`, en: `New max ${maxCount} @ ${pos}` })
        .setAux([{ label: 'max', value: String(maxCount), role: 'final' }])
        .commit();
    },
  };

  const { maxCount, atPos } = greedyMaxIntersection(input, hooks);

  rec
    .begin({ zh: `最大重叠 ${maxCount} 位于 ${atPos}`, en: `Max overlap ${maxCount} at ${atPos}` })
    .setAux([{ label: '结果', value: `max=${maxCount} @${atPos}`, role: 'final' }])
    .commit();

  return rec.build();
}
