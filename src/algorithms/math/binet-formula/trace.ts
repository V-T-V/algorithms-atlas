// =============================================================================
// 比内公式 · 录制帧序列
// 通过 binetFormula 的钩子，把闭式计算过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binetFormula, type BinetFormulaHooks } from './impl.ts';

export const DEFAULT_INPUT = 10;

/** 录制演示帧序列：计算 F_0 .. F_n 并以柱状图展示。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const results: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (results.length > 0) roles[results.length - 1] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(results, roles)).commit();
  };

  rec
    .begin({ zh: `用比内公式计算 F_0 .. F_${n}`, en: `Compute F_0 .. F_${n} via Binet's formula` })
    .setAux([
      { label: '闭式', value: 'F_n = (φⁿ − ψⁿ) / √5', role: 'frontier' as BarRole },
      { label: 'φ', value: '(1+√5)/2 ≈ 1.618', role: 'default' as BarRole },
      { label: 'ψ', value: '(1−√5)/2 ≈ −0.618', role: 'default' as BarRole },
    ])
    .commit();

  for (let i = 0; i <= n; i++) {
    const v = binetFormula(i);
    results.push(v);
    snapshot({
      zh: `F_${i} = ${v}`,
      en: `F_${i} = ${v}`,
    });
  }

  rec
    .begin({ zh: `计算完成：F_${n} = ${results[n]}`, en: `Done: F_${n} = ${results[n]}` })
    .setBars(results.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  void (null as unknown as BinetFormulaHooks);
  return rec.build();
}
