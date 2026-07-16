import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveCongruenceSystem, type ModularSystemHooks } from './impl.ts';

export const DEFAULT_EQUATIONS = [
  { remainder: 2, modulus: 3 },
  { remainder: 3, modulus: 5 },
  { remainder: 2, modulus: 7 },
];

export function buildTrace(
  equations: Array<{ remainder: number; modulus: number }> = DEFAULT_EQUATIONS,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${equations.length} 个同余`, en: `${equations.length} congruences` })
    .setAux([{ label: '方程数', value: String(equations.length), role: 'frontier' }])
    .commit();

  const hooks: ModularSystemHooks = {
    onMerge: (a, n, b, m, newA, newM) => {
      rec
        .begin({
          zh: `合并 x≡${a}(mod ${n}) & x≡${b}(mod ${m}) → ${newA === null ? '无解' : `x≡${newA}(mod ${newM})`}`,
          en: `Merge x≡${a}(mod ${n}) & x≡${b}(mod ${m}) → ${newA === null ? 'no solution' : `x≡${newA}(mod ${newM})`}`,
        })
        .setBars([
          { value: n, role: 'compare' as BarRole },
          { value: m, role: 'compare' as BarRole },
          { value: newM, role: (newA === null ? 'warn' : 'final') as BarRole },
        ])
        .setAux([
          {
            label: '新模',
            value: String(newM),
            role: newA === null ? ('warn' as BarRole) : 'final',
          },
          {
            label: '新余',
            value: newA === null ? '无解' : String(newA),
            role: newA === null ? ('warn' as BarRole) : 'final',
          },
        ])
        .commit();
    },
  };

  const { remainder, modulus } = solveCongruenceSystem(equations, hooks);

  rec
    .begin({
      zh: remainder === null ? '无解' : `x ≡ ${remainder} (mod ${modulus})`,
      en: remainder === null ? 'No solution' : `x ≡ ${remainder} (mod ${modulus})`,
    })
    .setAux([
      {
        label: '结果',
        value: remainder === null ? '无解' : `${remainder} (mod ${modulus})`,
        role: remainder === null ? ('warn' as BarRole) : 'final',
      },
    ])
    .commit();

  return rec.build();
}
