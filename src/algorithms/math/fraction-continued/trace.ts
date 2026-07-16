// =============================================================================
// 连分数化简 · 录制帧序列
// 演示 √13 的周期连分数展开。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqrtPeriodicCf, type FractionContinuedHooks } from './impl.ts';

export const DEFAULT_INPUT: { D: bigint } = { D: 13n };

export function buildTrace(input: { D: number | bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const D = typeof input.D === 'number' ? BigInt(input.D) : input.D;

  const coeffs: string[] = [];

  rec
    .begin({ zh: `展开 √${D} 的周期连分数`, en: `Expand periodic CF of √${D}` })
    .setAux([{ label: 'D', value: D.toString(), role: 'frontier' }])
    .commit();

  const hooks: FractionContinuedHooks = {
    onCoefficient: (k, a) => {
      coeffs.push(a.toString());
      rec
        .begin({
          zh: `a_${k} = ${a}（已展开 [${coeffs.join(', ')}]）`,
          en: `a_${k} = ${a} (so far [${coeffs.join(', ')}])`,
        })
        .setAux([
          { label: '系数', value: coeffs.join(', '), role: k === 0 ? 'frontier' : 'compare' },
        ])
        .commit();
    },
  };

  const { prefix, period } = sqrtPeriodicCf(D, hooks);

  rec
    .begin({
      zh: `√${D} = [${prefix.join('; ')}; $\\overline{${period.join(', ')}}$]`,
      en: `√${D} = [${prefix.join('; ')}; overline{${period.join(', ')}}]`,
    })
    .setAux([
      { label: '前缀', value: prefix.join(', '), role: 'final' },
      { label: '周期', value: period.join(', '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
