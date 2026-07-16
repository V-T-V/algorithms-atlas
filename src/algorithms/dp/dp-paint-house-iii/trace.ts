// =============================================================================
// 粉刷房子 III · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCostPaintHouseIII, type PaintHouseIIIHooks } from './impl.ts';

export const DEFAULT_HOUSES = [0, 0, 0, 0, 0];
export const DEFAULT_COST = [
  [1, 10],
  [10, 1],
  [10, 1],
  [1, 10],
  [5, 1],
];
export const DEFAULT_N = 2;
export const DEFAULT_TARGET = 3;

export function buildTrace(
  houses: number[] = DEFAULT_HOUSES,
  cost: number[][] = DEFAULT_COST,
  n: number = DEFAULT_N,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  let ans = 0;

  rec
    .begin({
      zh: `${houses.length} 栋房 / ${n} 色 / target=${target}`,
      en: `${houses.length} houses / ${n} colors / target=${target}`,
    })
    .setBars(
      houses.map((h, i) => ({
        value: h === 0 ? 0 : h,
        role: (h === 0 ? 'default' : 'pivot') as BarRole,
        label: `cost[${i}]=[${cost[i]!.join(',')}]`,
      })),
    )
    .setAux([{ label: '初始', value: '部分已上色', role: 'pivot' }])
    .commit();

  const hooks: PaintHouseIIIHooks = {
    onResult: (c) => {
      ans = c;
    },
  };
  minCostPaintHouseIII(houses, cost, n, target, hooks);

  rec
    .begin({
      zh: `完成：${ans < 0 ? '不可行' : `成本 ${ans}`}`,
      en: `Done: ${ans < 0 ? 'infeasible' : `cost ${ans}`}`,
    })
    .setBars(houses.map((h) => ({ value: h === 0 ? 0 : h, role: 'final' as BarRole })))
    .setAux([{ label: '最小成本 / cost', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
