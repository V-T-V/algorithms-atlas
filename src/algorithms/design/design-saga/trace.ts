import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runSaga } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  void runSaga(
    [
      { name: 'book', action: async () => {}, compensate: async () => {} },
      {
        name: 'pay',
        action: async () => {
          throw new Error('x');
        },
        compensate: async () => {},
      },
      { name: 'ship', action: async () => {}, compensate: async () => {} },
    ],
    {},
    {
      onStep: (n) =>
        rec
          .begin({ zh: `step ${n}`, en: `step ${n}` })
          .setAux([{ label: 'step', value: n, role: 'compare' as BarRole }])
          .commit(),
      onCompensate: (n) =>
        rec
          .begin({ zh: `compensate ${n}`, en: `compensate ${n}` })
          .setAux([{ label: 'compensate', value: n, role: 'warn' as BarRole }])
          .commit(),
      onDone: (ok) =>
        rec
          .begin({ zh: ok ? '完成' : '已补偿', en: '' })
          .setAux([
            { label: 'result', value: String(ok), role: ok ? 'final' : ('warn' as BarRole) },
          ])
          .commit(),
    },
  );
  return rec.build();
}
