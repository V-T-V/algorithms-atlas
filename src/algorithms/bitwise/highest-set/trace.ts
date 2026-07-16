// =============================================================================
// 最高设置位 · 录制帧序列
// 逐元素展示「自或右移」把低位填满 1 的过程，最终 `(v>>1)+1` 得到最高位权值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { highestSet, type HighestSetHooks } from './impl.ts';

export const DEFAULT_INPUT = [18, 256, 1000, 7, 1, 1023, 65535];

const bin = (n: number): string => (n >>> 0).toString(2).padStart(16, '0').slice(-16);

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

  input.forEach((x, idx) => {
    const roles: BarRole[] = input.map(() => 'default');
    roles[idx] = 'pivot';
    const shifts = [1, 2, 4, 8, 16];
    const hooks: HighestSetHooks = {
      onPropagate: (step, v) => {
        if (step < 3) {
          // 只录前 3 步以避免帧过多
          rec
            .begin({
              zh: `x = ${x}：v |= v >>> ${shifts[step]} → ${v >>> 0} (${bin(v)})`,
              en: `x = ${x}: v |= v >>> ${shifts[step]} → ${v >>> 0} (${bin(v)})`,
            })
            .setArray([...input], roles, [{ index: idx, label: 'i' }])
            .setAux([{ label: `v (after >>${shifts[step]})`, value: bin(v), role: 'frontier' }])
            .commit();
        }
      },
    };
    const result = highestSet(x, hooks);
    out.push(result);
    rec
      .begin({
        zh: `x = ${x} (${bin(x)}) → 最高位权值 = ${result} (${bin(result)})`,
        en: `x = ${x} (${bin(x)}) → MSB weight = ${result} (${bin(result)})`,
      })
      .setArray([...input], roles, [{ index: idx, label: 'i' }])
      .setAux([
        { label: 'x', value: bin(x), role: 'pivot' },
        { label: '最高位权值', value: String(result), role: 'final' },
      ])
      .commit();
  });

  rec
    .begin({
      zh: `完成：最高设置位数组为 ${out.join(', ')}`,
      en: `Done: highest set bits = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
