// 最大单元数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxUnits, type GreedyMaxUnitsHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  boxTypes: [
    [1, 3],
    [2, 2],
    [3, 1],
  ] as ReadonlyArray<readonly [number, number]>,
  truckSize: 4,
};

export function buildTrace(
  input: { boxTypes: ReadonlyArray<readonly [number, number]>; truckSize: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { boxTypes, truckSize } = input;

  rec
    .begin({
      zh: `${boxTypes.length} 类箱子，容量 ${truckSize}`,
      en: `${boxTypes.length} types, capacity ${truckSize}`,
    })
    .setBars(boxTypes.map((b) => ({ value: b[1], role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMaxUnitsHooks = {
    onPick: (_t, count, units) => {
      rec
        .begin({ zh: `取 ${count} 箱 × ${units} 单元`, en: `take ${count} x ${units} units` })
        .setBars([{ value: units, role: 'compare' as BarRole }])
        .commit();
    },
  };

  const result = greedyMaxUnits(boxTypes, truckSize, hooks);

  rec
    .begin({ zh: `完成：共 ${result} 单元`, en: `Done: ${result} units` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '总单元', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
