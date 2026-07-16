import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polynomialEval, type PolynomialEvalHooks } from './impl.ts';

export const DEFAULT_COEFFS = [1, 2, 3]; // 1 + 2x + 3x²
export const DEFAULT_X = 2;

export function buildTrace(coeffs: number[] = DEFAULT_COEFFS, x: number = DEFAULT_X): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ i: number; acc: number }> = [];

  rec
    .begin({
      zh: `求 [${coeffs.join(',')}] 在 x=${x}`,
      en: `Eval [${coeffs.join(',')}] at x=${x}`,
    })
    .setAux([
      { label: '系数', value: `[${coeffs.join(',')}]`, role: 'frontier' },
      { label: 'x', value: String(x), role: 'frontier' },
    ])
    .commit();

  const hooks: PolynomialEvalHooks = {
    onStep: (i, acc) => {
      steps.push({ i, acc });
      rec
        .begin({ zh: `i=${i}: acc=${acc}`, en: `i=${i}: acc=${acc}` })
        .setBars(
          steps.map((s) => ({ value: s.acc, role: (s.i === i ? 'compare' : 'sorted') as BarRole })),
        )
        .setAux([
          { label: 'i', value: String(i), role: 'frontier' },
          { label: 'acc', value: String(acc), role: 'final' },
        ])
        .commit();
    },
  };

  const ans = polynomialEval(coeffs, x, hooks);

  rec
    .begin({ zh: `结果=${ans}`, en: `Result=${ans}` })
    .setAux([{ label: '结果', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
