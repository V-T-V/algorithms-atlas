// =============================================================================
// 最小异或对 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minXorPair, type MinXorHooks } from './impl.ts';

export const DEFAULT_INPUT = [9, 5, 3, 12, 1, 7];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => a - b);
  let curIdx = -1;
  let bestPair: [number, number] | null = null;

  rec
    .begin({ zh: `原数组 [${input.join(', ')}]`, en: `Original [${input.join(', ')}]` })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  rec
    .begin({ zh: `排序后 [${sorted.join(', ')}]`, en: `Sorted [${sorted.join(', ')}]` })
    .setBars(sorted.map((v) => ({ value: v, role: 'frontier' as BarRole })))
    .commit();

  const hooks: MinXorHooks = {
    onPair: (a, b, xr) => {
      curIdx = sorted.indexOf(a);
      const roles: BarRole[] = sorted.map(() => 'default');
      if (curIdx >= 0) {
        roles[curIdx] = 'compare';
        if (curIdx + 1 < sorted.length) roles[curIdx + 1] = 'compare';
      }
      rec
        .begin({ zh: `相邻对 ${a} ^ ${b} = ${xr}`, en: `Adjacent ${a} ^ ${b} = ${xr}` })
        .setBars(sorted.map((v, i) => ({ value: v, role: roles[i]! })))
        .setAux([{ label: '当前异或', value: String(xr), role: 'compare' }])
        .commit();
    },
    onDone: (res) => {
      bestPair = res.pair;
      rec
        .begin({
          zh: bestPair ? `最小异或对 (${bestPair[0]}, ${bestPair[1]}) = ${res.minXor}` : '无对',
          en: bestPair ? `Min pair (${bestPair[0]}, ${bestPair[1]}) = ${res.minXor}` : 'no pair',
        })
        .setBars(sorted.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([{ label: '最小异或', value: String(res.minXor), role: 'final' }])
        .commit();
    },
  };

  minXorPair(input, hooks);

  return rec.build();
}
