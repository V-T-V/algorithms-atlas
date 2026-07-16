import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { withInterceptors } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const wrapped = withInterceptors(
    (x: number) => x * 2,
    [
      {
        pre: (x: number) => {
          void rec
            .begin({ zh: `pre 1: x=${x}`, en: '' })
            .setAux([{ label: 'x', value: String(x), role: 'compare' as BarRole }])
            .commit();
        },
        post: (r: number) => {
          void rec
            .begin({ zh: `post 1: r=${r}`, en: '' })
            .setAux([{ label: 'r', value: String(r), role: 'final' as BarRole }])
            .commit();
          return r;
        },
      },
    ],
  );
  void wrapped(5);
  return rec.build();
}
