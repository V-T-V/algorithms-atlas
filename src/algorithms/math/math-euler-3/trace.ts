// =============================================================================
// 欧拉函数（线性筛）· 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerSieve, type EulerSieveHooks } from './impl.ts';

export const DEFAULT_INPUT = 12;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let phi: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(phi.slice(1).map((v) => ({ value: v, role: 'frontier' })))
      .setAux(
        phi.slice(1).map((v, i) => ({ label: `φ(${i + 1})`, value: String(v), role: 'frontier' })),
      )
      .commit();
  };

  snap({ zh: `筛 1..${n} 的 φ`, en: `Sieve φ for 1..${n}` });

  const hooks: EulerSieveHooks = {
    onDone: (p) => {
      phi = p;
      snap({ zh: `完成 1..${n}`, en: `Done 1..${n}` });
    },
  };

  const result = eulerSieve(n, hooks);
  void result;

  rec
    .begin({ zh: `φ(${n})=${phi[n] ?? '-'}`, en: `φ(${n})=${phi[n] ?? '-'}` })
    .setAux([{ label: '答案', value: String(phi[n] ?? '-'), role: 'final' }])
    .commit();

  return rec.build();
}
