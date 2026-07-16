// =============================================================================
// Möbius · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mobiusSieve, type MobiusHooks } from './impl.ts';

export const DEFAULT_INPUT = 16;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let mu: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(mu.slice(1).map((v) => ({ value: v, role: v === 0 ? 'warn' : 'frontier' })))
      .setAux(
        mu.slice(1).map((v, i) => ({ label: `μ(${i + 1})`, value: String(v), role: 'frontier' })),
      )
      .commit();
  };

  snap({ zh: `筛 1..${n} 的 μ`, en: `Sieve μ for 1..${n}` });

  const hooks: MobiusHooks = {
    onDone: (m) => {
      mu = m;
      snap({ zh: `完成`, en: `Done` });
    },
  };

  mobiusSieve(n, hooks);

  rec
    .begin({ zh: `μ(${n})=${mu[n] ?? '-'}`, en: `μ(${n})=${mu[n] ?? '-'}` })
    .setAux([{ label: '答案', value: String(mu[n] ?? '-'), role: 'final' }])
    .commit();

  return rec.build();
}
