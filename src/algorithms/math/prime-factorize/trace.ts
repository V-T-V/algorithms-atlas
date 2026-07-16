// =============================================================================
// 质因数分解 · 录制帧序列
// 用 setMap 展示「质因子 → 指数」的累积字典，用 setAux 展示当前剩余值 m 与正在
// 试除的候选因子 d。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  primeFactorize,
  formatFactors,
  type PrimeFactor,
  type PrimeFactorizeHooks,
} from './impl.ts';

export const DEFAULT_INPUT = { n: 360 };

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.n;

  const factors: PrimeFactor[] = [];
  let remaining = n;
  let candidate = 0;
  let lastExp = 0;

  const snapshot = (note: { zh: string; en: string }, resultRole: BarRole = 'compare'): void => {
    const map = factors.map((f) => ({
      key: String(f.prime),
      value: f.exp === 1 ? '1' : String(f.exp),
      role: (factors.indexOf(f) === factors.length - 1 ? 'pivot' : 'final') as BarRole,
    }));
    rec
      .begin(note)
      .setMap(map)
      .setAux([
        { label: 'n', value: String(n), role: 'default' },
        { label: '剩余 m', value: String(remaining), role: resultRole },
        { label: '候选因子 d', value: String(candidate), role: 'frontier' },
        { label: '当前指数', value: String(lastExp), role: 'compare' },
      ])
      .commit();
  };

  snapshot({
    zh: `分解 ${n}：从最小的质因子开始试除`,
    en: `Factorize ${n}: trial-divide from the smallest prime`,
  });

  const hooks: PrimeFactorizeHooks = {
    onTry: (m, d) => {
      remaining = m;
      candidate = d;
      lastExp = 0;
      snapshot({
        zh: `尝试用 ${d} 除 ${m}`,
        en: `Try dividing ${m} by ${d}`,
      });
    },
    onFactor: (m, p, exp) => {
      remaining = m;
      lastExp = exp;
      snapshot({
        zh: `${p} 是因子（第 ${exp} 次），剩余 m = ${m}`,
        en: `${p} is a factor (×${exp}), remaining m = ${m}`,
      });
    },
    onFactorComplete: (p, exp) => {
      factors.push({ prime: p, exp });
      lastExp = exp;
      snapshot(
        {
          zh: `确定质因子 ${p}^${exp}`,
          en: `Confirmed prime factor ${p}^${exp}`,
        },
        'final',
      );
    },
    onDone: (_n, all) => {
      factors.length = 0;
      factors.push(...all);
    },
  };

  primeFactorize(n, hooks);

  // 终态
  rec
    .begin({
      zh: `${n} = ${formatFactors(factors)}`,
      en: `${n} = ${formatFactors(factors)}`,
    })
    .setMap(
      factors.map((f) => ({
        key: String(f.prime),
        value: String(f.exp),
        role: 'final' as BarRole,
      })),
    )
    .setAux([{ label: '结果', value: formatFactors(factors), role: 'final' }])
    .commit();

  return rec.build();
}
