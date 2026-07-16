// Floyd-Rivest 选择 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floydRivestSelect, type FloydRivestHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [7, 2, 9, 4, 1, 8, 5, 3, 6, 0, 11, 13], k: 5, seed: 3 };

export function buildTrace(
  input: { arr: number[]; k: number; seed?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k, seed = 3 } = input;
  const a = [...arr];
  let activeLo = 0;
  let activeHi = a.length - 1;
  let pivotIdxView = -1;
  let lt = -1;
  let gt = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let idx = 0; idx < a.length; idx++) {
      if (idx < activeLo || idx > activeHi) roles[idx] = 'sorted';
      else if (lt >= 0 && idx >= lt && idx <= gt) roles[idx] = 'frontier';
    }
    if (pivotIdxView >= 0 && roles[pivotIdxView] === undefined) roles[pivotIdxView] = 'pivot';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
  };

  snapshot({ zh: `找第 ${k + 1} 小（0-based k=${k}）`, en: `Find rank-${k} (0-based)` });

  const hooks: FloydRivestHooks = {
    onPartition: (lo, hi, kk, pIdx) => {
      activeLo = lo;
      activeHi = hi;
      pivotIdxView = pIdx;
      lt = -1;
      gt = -1;
      snapshot({
        zh: `[${lo},${hi}] 三向划分，基准 a[${pIdx}]=${a[pIdx]}`,
        en: `[${lo},${hi}] 3-way split, pivot a[${pIdx}]=${a[pIdx]}`,
      });
    },
    onSegregated: (pivotVal, l, g) => {
      lt = l;
      gt = g;
      const inside = k >= l && k <= g;
      snapshot({
        zh: `中段 [${l},${g}]（值=${pivotVal}），k=${k} ${inside ? '在中段→完成' : '在外侧→继续'}`,
        en: `Middle [${l},${g}] (val=${pivotVal}), k=${k} ${inside ? 'inside→done' : 'outside→recurse'}`,
      });
    },
  };

  const ans = floydRivestSelect(arr, k, seed, hooks);
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < a.length; i++) roles[i] = 'final';
  rec
    .begin({ zh: `第 ${k + 1} 小 = ${ans}`, en: `Rank-${k + 1} smallest = ${ans}` })
    .setBars(rec.barsFrom(a, roles))
    .commit();

  return rec.build();
}
