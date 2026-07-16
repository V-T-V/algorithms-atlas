// =============================================================================
// 加油站 · 录制帧序列
// 用 setBars 展示每站的净余油 surplus；用 setAux 展示当前 tank / 起点 / 总净余。
// 当前站 'compare'，被重置的起点之后 'frontier'，最终起点 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gasStation, type GasStationHooks } from './impl.ts';

export const DEFAULT_INPUT: { gas: number[]; cost: number[] } = {
  gas: [1, 2, 3, 4, 5],
  cost: [3, 4, 5, 1, 2],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { gas: number[]; cost: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { gas, cost } = input;
  const n = gas.length;
  const surplus = gas.map((g, i) => g - cost[i]!);

  let curI = -1;
  let tank = 0;
  let start = 0;
  let total = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (curI >= 0) roles[curI] = 'compare';
    if (start < n) roles[start] = 'frontier';
    rec
      .begin(note)
      .setBars(rec.barsFrom(surplus, roles))
      .setAux([
        { label: '当前起点 / start', value: String(start), role: 'frontier' },
        { label: '段内累计 / tank', value: String(tank), role: tank < 0 ? 'warn' : 'compare' },
        { label: '总净余 / total', value: String(total), role: 'final' },
      ])
      .commit();
  };

  snapshot({ zh: `净余油：[${surplus.join(', ')}]`, en: `Net surplus: [${surplus.join(', ')}]` });

  const hooks: GasStationHooks = {
    onVisit: (i, t) => {
      curI = i;
      tank = t;
      total += surplus[i]!;
      snapshot({
        zh: `站 ${i}：surplus=${surplus[i]!}，tank=${t}`,
        en: `Station ${i}: surplus=${surplus[i]!}, tank=${t}`,
      });
    },
    onReset: (i, newStart) => {
      start = newStart;
      tank = 0;
      snapshot({
        zh: `tank 跌负，起点重置为 ${newStart}`,
        en: `tank negative, reset start to ${newStart}`,
      });
    },
  };

  const result = gasStation(gas, cost, hooks);

  curI = -1;
  rec
    .begin({
      zh: result >= 0 ? `可行起点 = ${result}` : '无解（总净余 < 0）',
      en: result >= 0 ? `Feasible start = ${result}` : 'No solution (total surplus < 0)',
    })
    .setBars(rec.barsFrom(surplus, result >= 0 ? { [result]: 'final' as BarRole } : {}))
    .setAux([
      { label: '起点 / start', value: String(result), role: result >= 0 ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
