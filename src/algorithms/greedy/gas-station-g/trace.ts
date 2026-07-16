// 加油站 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gasStationG, type GasStationGHooks } from './impl.ts';

export interface GsInput {
  gas: number[];
  cost: number[];
}

export const DEFAULT_INPUT: GsInput = { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] };

/** 录制演示帧序列。 */
export function buildTrace(input: GsInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { gas, cost } = input;

  rec
    .begin({
      zh: `gas=${gas.join(',')}，cost=${cost.join(',')}`,
      en: `gas=${gas.join(',')}, cost=${cost.join(',')}`,
    })
    .setArray(
      gas,
      gas.map(() => 'default' as BarRole),
      [{ index: 0, label: 'start' }],
    )
    .commit();

  const hooks: GasStationGHooks = {
    onReset: (start) => {
      rec
        .begin({
          zh: `油箱为负，重置起点为 ${start}`,
          en: `Tank negative, reset start to ${start}`,
        })
        .setArray(
          gas,
          gas.map((_, i) => (i === start ? 'pivot' : 'default') as BarRole),
          [{ index: start, label: 'start' }],
        )
        .commit();
    },
  };
  const { start } = gasStationG(gas, cost, hooks);

  rec
    .begin({ zh: `完成：起点 = ${start}`, en: `Done: start = ${start}` })
    .setArray(
      gas,
      gas.map((_, i) => (i === start ? 'final' : 'default') as BarRole),
      [],
    )
    .setMap([{ key: '起点', value: String(start), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
