// =============================================================================
// 下一个 2 的幂 · 录制帧序列
// 逐元素展示对 `x-1` 的位填充过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nextPower2, type NextPower2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 1, 5, 8, 9, 33, 100, 1024, 1000];

const bin = (n: number): string => (n >>> 0).toString(2).padStart(11, '0').slice(-11);

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
    const hooks: NextPower2Hooks = {
      onPropagate: (step, v) => {
        if (step < 3) {
          rec
            .begin({
              zh: `x = ${x}：v = (x-1) |= v >>> ${shifts[step]} → ${v >>> 0} (${bin(v)})`,
              en: `x = ${x}: v = (x-1) |= v >>> ${shifts[step]} → ${v >>> 0} (${bin(v)})`,
            })
            .setArray([...input], roles, [{ index: idx, label: 'i' }])
            .setAux([{ label: `填充后 v (>>${shifts[step]})`, value: bin(v), role: 'frontier' }])
            .commit();
        }
      },
    };
    const result = nextPower2(x, hooks);
    out.push(result);
    rec
      .begin({
        zh: `x = ${x} → 下一个 2 的幂 = ${result}`,
        en: `x = ${x} → next power of 2 = ${result}`,
      })
      .setArray([...input], roles, [{ index: idx, label: 'i' }])
      .setAux([
        { label: 'x', value: String(x), role: 'pivot' },
        { label: '≥ x 的最小 2 的幂', value: String(result), role: 'final' },
      ])
      .commit();
  });

  rec
    .begin({
      zh: `完成：结果数组为 ${out.join(', ')}`,
      en: `Done: next powers of 2 = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
