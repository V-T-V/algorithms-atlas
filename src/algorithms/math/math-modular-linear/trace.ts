import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveLinearCongruence, type ModularLinearHooks } from './impl.ts';

export const DEFAULT_A = 14;
export const DEFAULT_B = 30;
export const DEFAULT_M = 100;

export function buildTrace(
  a: number = DEFAULT_A,
  b: number = DEFAULT_B,
  m: number = DEFAULT_M,
): Frame[] {
  const rec = new TraceRecorder();
  const solutions: number[] = [];

  rec
    .begin({ zh: `${a}x ≡ ${b} (mod ${m})`, en: `${a}x ≡ ${b} (mod ${m})` })
    .setAux([
      { label: 'a', value: String(a), role: 'frontier' },
      { label: 'b', value: String(b), role: 'frontier' },
      { label: 'm', value: String(m), role: 'frontier' },
    ])
    .commit();

  const hooks: ModularLinearHooks = {
    onSolution: (x) => {
      solutions.push(x);
      rec
        .begin({ zh: `解 x=${x}`, en: `Solution x=${x}` })
        .setBars(solutions.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([{ label: 'x', value: String(x), role: 'final' }])
        .commit();
    },
  };

  const sols = solveLinearCongruence(a, b, m, hooks);

  rec
    .begin({ zh: `共 ${sols.length} 解`, en: `${sols.length} solutions` })
    .setAux([
      {
        label: '解数',
        value: String(sols.length),
        role: sols.length > 0 ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
