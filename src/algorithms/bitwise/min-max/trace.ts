// =============================================================================
// 位运算 min/max · 录制帧序列
// 逐对演示无分支 min/max 推导。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minMax, type MinMaxHooks } from './impl.ts';

export const DEFAULT_INPUT: Array<[number, number]> = [
  [5, 9],
  [12, 3],
  [-4, 7],
  [8, 8],
  [-10, -3],
];

/** 录制演示帧序列。 */
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `输入数对：${input.map(([a, b]) => `(${a}, ${b})`).join('  ')}`,
      en: `Input pairs: ${input.map(([a, b]) => `(${a}, ${b})`).join('  ')}`,
    })
    .setAux([{ label: '公式', value: 'mask = (b-a) >> 31; min/max 用 XOR 选取', role: 'pivot' }])
    .commit();

  const results: Array<{ a: number; b: number; min: number; max: number }> = [];

  input.forEach(([a, b]) => {
    const hooks: MinMaxHooks = {
      onResolve: (av, bv, diff, min, max) => {
        results.push({ a: av, b: bv, min, max });
        rec
          .begin({
            zh: `a = ${av}, b = ${bv}：diff = b − a = ${diff}，mask = ${diff >> 31} → min = ${min}，max = ${max}`,
            en: `a = ${av}, b = ${bv}: diff = b − a = ${diff}, mask = ${diff >> 31} → min = ${min}, max = ${max}`,
          })
          .setAux([
            { label: 'a', value: String(av), role: 'pivot' },
            { label: 'b', value: String(bv), role: 'pivot' },
            { label: 'min', value: String(min), role: 'final' },
            { label: 'max', value: String(max), role: 'final' },
          ] as Array<{ label: string; value: string; role?: BarRole }>)
          .commit();
      },
    };
    minMax(a, b, hooks);
  });

  rec
    .begin({
      zh: `完成，共处理 ${results.length} 对`,
      en: `Done; processed ${results.length} pairs`,
    })
    .setAux(
      results.map((r) => ({
        label: `(${r.a},${r.b})`,
        value: `min=${r.min},max=${r.max}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
