import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { largeCombine, type LargeCombineHooks } from './impl.ts';

export const DEFAULT_N = 10;
export const DEFAULT_K = 4;

function digitCount(b: bigint): number {
  if (b === 0n) return 1;
  return b.toString().length;
}

export function buildTrace(n: number = DEFAULT_N, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ i: number; digits: number }> = [];

  rec
    .begin({ zh: `C(${n},${k})`, en: `C(${n},${k})` })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'k', value: String(k), role: 'frontier' },
    ])
    .commit();

  const hooks: LargeCombineHooks = {
    onStep: (i, value) => {
      steps.push({ i, digits: digitCount(value) });
      rec
        .begin({ zh: `i=${i}：C=${value}`, en: `i=${i}: C=${value}` })
        .setBars(
          steps.map((s) => ({
            value: s.digits,
            role: (s.i === i ? 'compare' : 'sorted') as BarRole,
          })),
        )
        .setAux([
          { label: 'i', value: String(i), role: 'frontier' },
          { label: 'C(n,i)', value: value.toString(), role: 'final' },
        ])
        .commit();
    },
  };

  const ans = largeCombine(n, k, hooks);

  rec
    .begin({ zh: `C(${n},${k}) = ${ans}`, en: `C(${n},${k}) = ${ans}` })
    .setAux([{ label: '结果', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
