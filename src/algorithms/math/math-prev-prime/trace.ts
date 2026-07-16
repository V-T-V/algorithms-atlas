import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { prevPrime, type PrevPrimeHooks } from './impl.ts';

export const DEFAULT_N = 20;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const tested: number[] = [];
  let ans = 0;

  rec
    .begin({ zh: `n=${n}`, en: `n=${n}` })
    .setAux([{ label: '起始', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: PrevPrimeHooks = {
    onTest: (cand, ip) => {
      tested.push(cand);
      rec
        .begin({
          zh: `${cand} ${ip ? '是素数' : '不是'}`,
          en: `${cand} ${ip ? 'prime' : 'not prime'}`,
        })
        .setBars(
          tested.map((v) => ({
            value: v,
            role: (v === cand && ip ? 'final' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '当前候选', value: String(cand), role: ip ? 'final' : ('warn' as BarRole) },
        ])
        .commit();
    },
    onDone: (p) => {
      ans = p;
    },
  };

  prevPrime(n, hooks);

  rec
    .begin({ zh: `上一个素数=${ans}`, en: `Prev prime=${ans}` })
    .setAux([{ label: '结果', value: String(ans), role: ans < 0 ? 'warn' : ('final' as BarRole) }])
    .commit();

  return rec.build();
}
