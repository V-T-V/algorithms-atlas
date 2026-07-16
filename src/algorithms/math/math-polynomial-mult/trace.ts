import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polynomialMultiply, trimPoly, type PolynomialMultHooks } from './impl.ts';

export const DEFAULT_A = [1, 2, 3]; // 1 + 2x + 3x^2
export const DEFAULT_B = [2, 1]; // 2 + x

export function buildTrace(a: number[] = DEFAULT_A, b: number[] = DEFAULT_B): Frame[] {
  const rec = new TraceRecorder();
  let result: number[] = new Array(Math.max(1, a.length + b.length - 1)).fill(0);

  rec
    .begin({
      zh: `(${a.join(',')}) × (${b.join(',')})`,
      en: `(${a.join(',')}) * (${b.join(',')})`,
    })
    .setBars(result.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([
      { label: 'a', value: `[${a.join(',')}]`, role: 'frontier' },
      { label: 'b', value: `[${b.join(',')}]`, role: 'frontier' },
    ])
    .commit();

  const hooks: PolynomialMultHooks = {
    onProduct: (i, j, term, dest) => {
      result = result.slice();
      result[dest] = result[dest]!; // ensure defined
      rec
        .begin({
          zh: `a[${i}]*b[${j}]=${term} → c[${dest}]`,
          en: `a[${i}]*b[${j}]=${term} -> c[${dest}]`,
        })
        .setBars(
          result.map((v, idx) => ({
            value: v,
            role: (idx === dest ? 'compare' : 'sorted') as BarRole,
          })),
        )
        .setAux([
          { label: 'i,j', value: `${i},${j}`, role: 'frontier' },
          { label: '项', value: String(term), role: 'compare' },
          { label: 'c[dest]', value: String(result[dest]), role: 'final' },
        ])
        .commit();
    },
  };

  const full = polynomialMultiply(a, b, hooks);
  result = trimPoly(full);

  rec
    .begin({ zh: `结果 = [${result.join(',')}]`, en: `Result = [${result.join(',')}]` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '系数', value: `[${result.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
