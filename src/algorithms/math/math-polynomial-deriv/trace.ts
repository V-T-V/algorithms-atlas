import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polynomialDerivative, type PolynomialDerivHooks } from './impl.ts';

export const DEFAULT_COEFFS = [5, 3, 2, 1]; // 5 + 3x + 2x² + x³

export function buildTrace(coeffs: number[] = DEFAULT_COEFFS): Frame[] {
  const rec = new TraceRecorder();
  const result: number[] = [];

  rec
    .begin({ zh: `求导 [${coeffs.join(',')}]`, en: `D/dx [${coeffs.join(',')}]` })
    .setAux([{ label: '系数', value: `[${coeffs.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: PolynomialDerivHooks = {
    onTerm: (i, oldCoef, newCoef) => {
      result.push(newCoef);
      rec
        .begin({ zh: `${i}·${oldCoef}=${newCoef}`, en: `${i}*${oldCoef}=${newCoef}` })
        .setBars(
          result.map((v, idx) => ({
            value: v,
            role: (idx === result.length - 1 ? 'compare' : 'sorted') as BarRole,
          })),
        )
        .setAux([
          { label: 'i', value: String(i), role: 'frontier' },
          { label: '新系数', value: String(newCoef), role: 'final' },
        ])
        .commit();
    },
  };

  const ans = polynomialDerivative(coeffs, hooks);

  rec
    .begin({ zh: `导数 = [${ans.join(',')}]`, en: `Derivative = [${ans.join(',')}]` })
    .setAux([{ label: '结果', value: `[${ans.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
