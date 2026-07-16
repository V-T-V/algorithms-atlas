import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polynomialIntegral, type PolynomialIntegHooks } from './impl.ts';

export const DEFAULT_COEFFS = [3, 4, 3]; // 3 + 4x + 3x²

export function buildTrace(coeffs: number[] = DEFAULT_COEFFS): Frame[] {
  const rec = new TraceRecorder();
  const result: number[] = [0];

  rec
    .begin({ zh: `积分 [${coeffs.join(',')}]`, en: `∫ [${coeffs.join(',')}] dx` })
    .setBars([{ value: 0, role: 'sorted' as BarRole }])
    .setAux([{ label: '系数', value: `[${coeffs.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: PolynomialIntegHooks = {
    onTerm: (i, oldCoef, newCoef) => {
      result.push(newCoef);
      rec
        .begin({ zh: `${oldCoef}/${i}=${newCoef}`, en: `${oldCoef}/${i}=${newCoef}` })
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

  const ans = polynomialIntegral(coeffs, hooks);

  rec
    .begin({ zh: `积分 = [${ans.join(',')}]`, en: `Integral = [${ans.join(',')}]` })
    .setAux([{ label: '结果', value: `[${ans.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
