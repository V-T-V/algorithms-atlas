// =============================================================================
// 数组分块 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BlockArray, type BlockHooks } from './impl.ts';

export const DEFAULT_INPUT: { arr: number[]; queries: Array<[number, number]> } = {
  arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  queries: [
    [2, 7],
    [0, 9],
    [4, 5],
  ],
};

export function buildTrace(
  input: { arr: number[]; queries: Array<[number, number]> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { arr, queries } = input;

  rec
    .begin({ zh: `分块 [${arr.join(',')}]`, en: `Block-decompose [${arr.join(',')}]` })
    .setArray(arr, new Array(arr.length).fill('default'), [])
    .commit();

  const hooks: BlockHooks = {
    onBuildBlock: (b, sum) => {
      rec
        .begin({ zh: `建块 ${b}，块和 = ${sum}`, en: `Build block ${b}, sum = ${sum}` })
        .setAux([{ label: `块${b}`, value: String(sum), role: 'sorted' }])
        .commit();
    },
    onQueryFullBlock: (b, sum) => {
      rec
        .begin({ zh: `整块 ${b} 直接取和 = ${sum}`, en: `Full block ${b} sum = ${sum}` })
        .setAux([{ label: '整块', value: String(sum), role: 'compare' }])
        .commit();
    },
    onQueryPartial: (idx) => {
      const roles: BarRole[] = new Array(arr.length).fill('default');
      roles[idx] = 'frontier';
      rec
        .begin({
          zh: `零散累加 data[${idx}] = ${arr[idx]}`,
          en: `Partial add data[${idx}] = ${arr[idx]}`,
        })
        .setArray(arr, roles, [])
        .commit();
    },
  };

  const ba = new BlockArray(arr, hooks);
  for (const [l, r] of queries) {
    const sum = ba.rangeSum(l, r);
    const roles: BarRole[] = new Array(arr.length).fill('default');
    for (let i = l; i <= r; i++) roles[i] = 'final';
    rec
      .begin({ zh: `区间 [${l},${r}] 和 = ${sum}`, en: `Range [${l},${r}] sum = ${sum}` })
      .setArray(arr, roles, [])
      .setAux([{ label: '和', value: String(sum), role: 'final' }])
      .commit();
  }

  return rec.build();
}
