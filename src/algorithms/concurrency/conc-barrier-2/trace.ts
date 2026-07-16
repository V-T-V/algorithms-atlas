import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBarrier2 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '屏障 v2（3 线程）', en: 'Barrier v2 (3 threads)' }).commit();
  simulateBarrier2(
    3,
    [
      { thread: 0, action: 'arrive' },
      { thread: 1, action: 'arrive' },
      { thread: 2, action: 'arrive' }, // 放行
      { thread: 0, action: 'arrive' },
    ],
    {
      onArrive: (t, a, n) =>
        rec
          .begin({ zh: `T${t} 到达 ${a}/${n}`, en: `T${t} arrived ${a}/${n}` })
          .setBars(
            [0, 1, 2].map((i) => ({
              value: i < a ? 1 : 0,
              role: i < a ? 'swap' : ('default' as BarRole),
              label: 'T' + i,
            })),
          )
          .setAux([{ label: 'arrived', value: `${a}/${n}`, role: 'compare' as BarRole }])
          .commit(),
      onRelease: (g) =>
        rec
          .begin({ zh: `第 ${g} 代放行`, en: `gen ${g} released` })
          .setAux([{ label: 'release', value: 'gen ' + g, role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
