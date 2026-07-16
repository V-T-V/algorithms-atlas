// =============================================================================
// 下一个排列 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nextPermutation, type NextPermHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const arr = [...input];

  const snapshot = (note: { zh: string; en: string }, highlight: number[] = []): void => {
    const roles: BarRole[] = arr.map((_, i) =>
      highlight.includes(i) ? ('swap' as BarRole) : ('default' as BarRole),
    );
    rec
      .begin(note)
      .setArray([...arr], roles, [])
      .setAux([{ label: '当前排列', value: arr.join(','), role: 'final' as BarRole }])
      .commit();
  };

  snapshot({ zh: `初始：[${arr.join(',')}]`, en: `Initial: [${arr.join(',')}]` });

  const hooks: NextPermHooks = {
    onSwap: (i, j) =>
      snapshot(
        {
          zh: `交换 arr[${i}]=${arr[i]} 与 arr[${j}]=${arr[j]}`,
          en: `Swap arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}`,
        },
        [i, j],
      ),
    onReverse: (lo, hi) =>
      snapshot({
        zh: `反转 [${lo}..${hi}]`,
        en: `Reverse [${lo}..${hi}]`,
      }),
  };

  nextPermutation(arr, hooks);

  snapshot({
    zh: `下一个排列：[${arr.join(',')}]`,
    en: `Next permutation: [${arr.join(',')}]`,
  });

  return rec.build();
}
