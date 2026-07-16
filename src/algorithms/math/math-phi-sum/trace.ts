import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { phiSum, type PhiSumHooks } from './impl.ts';

export const DEFAULT_N = 15;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const phiVals: number[] = [];

  rec
    .begin({ zh: `Φ(${n})`, en: `Φ(${n})` })
    .setAux([{ label: '上限', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: PhiSumHooks = {
    onValue: (k, phiK, sum) => {
      phiVals.push(phiK);
      rec
        .begin({ zh: `k=${k}, φ=${phiK}, 累加=${sum}`, en: `k=${k}, φ=${phiK}, sum=${sum}` })
        .setBars(
          phiVals.map((v, idx) => ({
            value: v,
            role: (idx === k - 1 ? 'compare' : 'sorted') as BarRole,
          })),
        )
        .setAux([
          { label: 'k', value: String(k), role: 'frontier' },
          { label: 'φ(k)', value: String(phiK), role: 'compare' },
          { label: 'Σ', value: String(sum), role: 'final' },
        ])
        .commit();
    },
  };

  const ans = phiSum(n, hooks);

  rec
    .begin({ zh: `Φ(${n}) = ${ans}`, en: `Φ(${n}) = ${ans}` })
    .setAux([{ label: '结果', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
