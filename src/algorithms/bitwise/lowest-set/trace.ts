// =============================================================================
// 最低设置位 · 录制帧序列
// 逐元素展示 x & -x 的分离过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lowestSet, type LowestSetHooks } from './impl.ts';

export const DEFAULT_INPUT = [12, 10, 7, 40, 1, 32, 0];

const bin = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out: number[] = [];

  rec
    .begin({
      zh: `输入数组：${input.join(', ')}`,
      en: `Input array: ${input.join(', ')}`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [{ index: 0, label: 'i' }],
    )
    .commit();

  const hooks: LowestSetHooks = {
    onIsolate: (x, isolated) => {
      const i = out.length;
      out.push(isolated);
      const roles: BarRole[] = input.map(() => 'default');
      roles[i] = 'pivot';
      rec
        .begin({
          zh: `x = ${x} (${bin(x)}) → x & -x = ${isolated} (${bin(isolated)})`,
          en: `x = ${x} (${bin(x)}) → x & -x = ${isolated} (${bin(isolated)})`,
        })
        .setArray([...input], roles, [{ index: i, label: 'i' }])
        .setAux([
          { label: 'x', value: `${x} (${bin(x)})`, role: 'pivot' },
          { label: '-x', value: `${-x | 0} (${bin(-x)})`, role: 'compare' },
          { label: 'x & -x', value: `${isolated} (${bin(isolated)})`, role: 'final' },
        ])
        .commit();
    },
  };

  for (const x of input) lowestSet(x, hooks);

  rec
    .begin({
      zh: `完成：最低设置位数组为 ${out.join(', ')}`,
      en: `Done: lowest set bits = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
