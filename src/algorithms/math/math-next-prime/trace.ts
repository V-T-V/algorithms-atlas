// =============================================================================
// 下一个素数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nextPrime, type NextPrimeHooks } from './impl.ts';

export const DEFAULT_N = 20;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const tested: number[] = [];
  let ans = 0;

  rec
    .begin({ zh: `n=${n}`, en: `n=${n}` })
    .setAux([{ label: '起始', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: NextPrimeHooks = {
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

  nextPrime(n, hooks);

  rec
    .begin({ zh: `下一个素数=${ans}`, en: `Next prime=${ans}` })
    .setAux([{ label: '结果', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
