import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cipolla, type CipollaHooks } from './impl.ts';

export const DEFAULT_N = 2;
export const DEFAULT_P = 17; // 6² = 36 ≡ 2 (mod 17)

export function buildTrace(n: number = DEFAULT_N, p: number = DEFAULT_P): Frame[] {
  const rec = new TraceRecorder();
  const tried: number[] = [];

  rec
    .begin({ zh: `√${n} mod ${p}`, en: `sqrt(${n}) mod ${p}` })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'p', value: String(p), role: 'frontier' },
    ])
    .commit();

  const hooks: CipollaHooks = {
    onCandidate: (a, omega2, isnr) => {
      tried.push(a);
      rec
        .begin({
          zh: `a=${a}, ω²=${omega2} ${isnr ? '非剩余' : '剩余'}`,
          en: `a=${a}, ω²=${omega2} ${isnr ? 'non-res' : 'res'}`,
        })
        .setBars(
          tried.map((v) => ({ value: v, role: (v === a ? 'compare' : 'default') as BarRole })),
        )
        .setAux([
          { label: 'a', value: String(a), role: 'frontier' },
          { label: 'ω²', value: String(omega2), role: isnr ? 'final' : ('warn' as BarRole) },
        ])
        .commit();
    },
    onResult: (root) => {
      rec
        .begin({
          zh: root === null ? '无解' : `根=${root}`,
          en: root === null ? 'No solution' : `Root=${root}`,
        })
        .setAux([
          {
            label: '根',
            value: root === null ? '无' : String(root),
            role: root === null ? ('warn' as BarRole) : 'final',
          },
        ])
        .commit();
    },
  };

  cipolla(n, p, hooks);

  return rec.build();
}
