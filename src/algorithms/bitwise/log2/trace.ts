// =============================================================================
// 整数 log2 · 录制帧序列
// 逐元素展示 ⌊log2(x)⌋ 的结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { log2, type Log2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 8, 10, 16, 255, 1024, 0];

const bin = (n: number): string => (n >>> 0).toString(2);

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

  const hooks: Log2Hooks = {
    onResult: (x, lg) => {
      const i = out.length;
      out.push(lg);
      const roles: BarRole[] = input.map(() => 'default');
      roles[i] = 'pivot';
      rec
        .begin({
          zh: `x = ${x} (${bin(x >>> 0)}) → ⌊log2⌋ = ${lg}${lg >= 0 ? `（即 ${x >= 1 << lg ? '≥' : ''}2^${lg}）` : '（无定义）'}`,
          en: `x = ${x} (${bin(x >>> 0)}) → ⌊log2⌋ = ${lg}${lg >= 0 ? ` (≥ 2^${lg})` : ' (undefined)'}`,
        })
        .setArray([...input], roles, [{ index: i, label: 'i' }])
        .setAux([
          { label: 'x', value: String(x), role: 'pivot' },
          { label: 'x (二进制)', value: bin(x >>> 0), role: 'compare' },
          { label: '⌊log2(x)⌋', value: String(lg), role: 'final' },
        ])
        .commit();
    },
  };

  for (const x of input) log2(x, hooks);

  rec
    .begin({
      zh: `完成：log2 数组为 ${out.join(', ')}`,
      en: `Done: floor-log2 values = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
