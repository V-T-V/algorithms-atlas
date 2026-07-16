// =============================================================================
// 完全数判定 · 录制帧序列
// 用 setAux 展示逐因数累加过程与最终判定。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPerfectNumber, type PerfectNumberHooks } from './impl.ts';

export const DEFAULT_INPUT = 28;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const found: Array<{ d: number; pair: number | null }> = [];
  let finalSum = 0;
  let finalOk = false;

  rec
    .begin({
      zh: `判定 ${n} 是否为完全数（真因数之和 == ${n}）`,
      en: `Check if ${n} is a perfect number (sum of proper divisors == ${n})`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: '当前累加和', value: '0', role: 'frontier' as BarRole },
      { label: '方法', value: '遍历到 √n 成对枚举', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: PerfectNumberHooks = {
    onDivisor: (d, pair, partial) => {
      found.push({ d, pair });
      const divList = found
        .flatMap((f) => (f.pair !== null ? [f.d, f.pair] : [f.d]))
        .sort((a, b) => a - b);
      rec
        .begin({
          zh: `找到因数 ${d}${pair !== null ? ` 与 ${pair}` : ''}，累加和 = ${partial}`,
          en: `Found divisor ${d}${pair !== null ? ` and ${pair}` : ''}, partial sum = ${partial}`,
        })
        .setAux([
          { label: 'n', value: String(n), role: 'pivot' as BarRole },
          { label: '当前累加和', value: String(partial), role: 'final' as BarRole },
          { label: '已发现因数', value: divList.join(', '), role: 'compare' as BarRole },
          { label: '进度', value: `${found.length} 对`, role: 'default' as BarRole },
        ])
        .commit();
    },
    onResult: (_nn, sum, ok) => {
      finalSum = sum;
      finalOk = ok;
    },
  };

  isPerfectNumber(n, hooks);

  // 终态
  rec
    .begin({
      zh: finalOk
        ? `${n} 是完全数（真因数之和 ${finalSum} == ${n}）`
        : `${n} 不是完全数（真因数之和 ${finalSum} ${finalSum < n ? '<' : '>'} ${n}）`,
      en: finalOk
        ? `${n} is a perfect number (sum of proper divisors ${finalSum} == ${n})`
        : `${n} is NOT perfect (sum of proper divisors ${finalSum} ${finalSum < n ? '<' : '>'} ${n})`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: '真因数之和', value: String(finalSum), role: 'compare' as BarRole },
      {
        label: '结论',
        value: finalOk ? '是完全数 / perfect' : '不是 / not perfect',
        role: (finalOk ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
