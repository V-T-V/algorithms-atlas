// =============================================================================
// 整数拆分 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integerBreak, type IntBreakHooks } from './impl.ts';

export const DEFAULT_INPUT = 10;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let resultFactors: number[] = [];
  let product = 0;

  rec
    .begin({ zh: `拆分 ${input} 使乘积最大`, en: `Break ${input} for max product` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: IntBreakHooks = {
    onStep: (k, remainder, partial) => {
      rec
        .begin({
          zh: `贪心取第 ${k} 个 3（余 ${remainder}）`,
          en: `Take 3 #${k} (remainder ${remainder})`,
        })
        .setBars(partial.map((f) => ({ value: f, role: 'frontier' as BarRole, label: String(f) })))
        .setAux([
          { label: '已取 3 的个数', value: String(k), role: 'compare' as BarRole },
          {
            label: '当前和',
            value: String(partial.reduce((s, x) => s + x, 0)),
            role: 'warn' as BarRole,
          },
        ])
        .commit();
    },
    onResult: (factors, p) => {
      resultFactors = factors;
      product = p;
    },
  };

  integerBreak(input, hooks);

  rec
    .begin({
      zh: `最优拆分：${input} = ${resultFactors.join('+')} = ${resultFactors.join('×')} = ${product}`,
      en: `Best: ${input} = ${resultFactors.join('+')} = ${resultFactors.join('×')} = ${product}`,
    })
    .setBars(resultFactors.map((f) => ({ value: f, role: 'final' as BarRole, label: String(f) })))
    .setAux([
      { label: '拆分', value: resultFactors.join('+'), role: 'compare' as BarRole },
      { label: '乘积', value: String(product), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
