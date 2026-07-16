import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { particleSwarm } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: 'PSO min x²+y²', en: 'PSO' }).commit();
  // fixed seed for reproducibility-ish
  const r = particleSwarm(f, 2, 20, 40, {
    onIter: (i, gb, gf) =>
      rec
        .begin({
          zh: `${i}: gBest=[${gb.map((v) => v.toFixed(2)).join(',')}] f=${gf.toFixed(4)}`,
          en: '',
        })
        .setBars([{ value: gf, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `best f=${r.gFit.toFixed(4)}`, en: '' }).commit();
  return rec.build();
}
