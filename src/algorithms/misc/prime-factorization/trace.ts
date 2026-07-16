// 质因数分解 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primeFactorization, type PrimeFactorizationHooks } from './impl.ts';

export const DEFAULT_INPUT = 360;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const foundFactors: Array<{ prime: number; exponent: number }> = [];
  let remaining = n;
  let curTrial = -1;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        foundFactors.map((f) => ({
          value: f.prime,
          role: 'final' as BarRole,
          label: `${f.prime}^${f.exponent}`,
        })),
      )
      .setAux([
        { label: '原始 n', value: String(n), role: 'pivot' as BarRole },
        { label: '剩余 remaining', value: String(remaining), role: 'frontier' as BarRole },
        {
          label: '当前试除 d',
          value: curTrial >= 0 ? String(curTrial) : '-',
          role: 'compare' as BarRole,
        },
        {
          label: '已找到因子',
          value: foundFactors.map((f) => `${f.prime}^${f.exponent}`).join(' × ') || '-',
          role: 'sorted' as BarRole,
        },
      ])
      .commit();
    curTrial = -1;
  };

  render({ zh: `分解 ${n}`, en: `Factorize ${n}` });

  const hooks: PrimeFactorizationHooks = {
    onFactor: (prime, exp, rem) => {
      remaining = rem;
      foundFactors.push({ prime, exponent: exp });
      render({
        zh: `找到因子 ${prime}（×${exp} 次），剩余 ${rem}`,
        en: `Factor ${prime} (×${exp}), remaining ${rem}`,
      });
    },
    onSkip: (d, rem) => {
      curTrial = d;
      remaining = rem;
      render({ zh: `试除 ${d}：不是因子`, en: `Trial ${d}: not a factor` });
    },
    onResult: () => {},
  };

  primeFactorization(n, hooks);

  const expr = foundFactors
    .map((f) => (f.exponent === 1 ? `${f.prime}` : `${f.prime}^${f.exponent}`))
    .join(' × ');
  rec
    .begin({ zh: `${n} = ${expr}`, en: `${n} = ${expr}` })
    .setBars(
      foundFactors.map((f) => ({
        value: f.prime,
        role: 'final' as BarRole,
        label: `${f.prime}^${f.exponent}`,
      })),
    )
    .setAux([{ label: '结果', value: expr, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
