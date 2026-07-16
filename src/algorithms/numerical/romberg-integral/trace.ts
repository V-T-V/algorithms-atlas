// =============================================================================
// 龙贝格积分 · 录制帧序列
// 求 ∫₀^1 4/(1+x²) dx = π。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { romberg, type RombergHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 0, b: 1, levels: 5 };

export function buildTrace(input?: { a?: number; b?: number; levels?: number }): Frame[] {
  const { a = 0, b = 1, levels = 5 } = input ?? {};
  const rec = new TraceRecorder();
  const f = (x: number): number => 4 / (1 + x * x); // 精确积分 = π

  rec
    .begin({
      zh: `求 ∫[${a},${b}] 4/(1+x²) dx（精确值 = π ≈ ${Math.PI}）`,
      en: `Integrate 4/(1+x²) on [${a},${b}] (exact = π ≈ ${Math.PI})`,
    })
    .setAux([{ label: '说明', value: 'Richardson 外推', role: 'pivot' as BarRole }])
    .commit();

  const hooks: RombergHooks = {
    onRow: (i, row) => {
      const best = row[row.length - 1]!;
      const err = Math.abs(best - Math.PI);
      rec
        .begin({
          zh: `第 ${i} 层：最佳估计 = ${best.toFixed(10)}，误差 = ${err.toExponential(3)}`,
          en: `Level ${i}: best = ${best.toFixed(10)}, error = ${err.toExponential(3)}`,
        })
        .setAux([
          { label: '层', value: String(i), role: 'pivot' as BarRole },
          { label: '最佳估计', value: best.toFixed(10), role: 'final' as BarRole },
          { label: '误差', value: err.toExponential(3), role: 'compare' as BarRole },
          {
            label: '该层表值',
            value: row.map((v) => v.toFixed(6)).join(', '),
            role: 'sorted' as BarRole,
          },
        ])
        .commit();
    },
  };

  const result = romberg(f, a, b, levels, hooks);

  rec
    .begin({
      zh: `完成：∫ = ${result.value.toFixed(10)}（π = ${Math.PI.toFixed(10)}）`,
      en: `Done: ∫ = ${result.value.toFixed(10)} (π = ${Math.PI.toFixed(10)})`,
    })
    .setMap([
      { key: '估计值', value: result.value.toFixed(10), role: 'final' as BarRole },
      { key: '精确值 π', value: Math.PI.toFixed(10), role: 'pivot' as BarRole },
      {
        key: '绝对误差',
        value: Math.abs(result.value - Math.PI).toExponential(3),
        role: 'compare' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
