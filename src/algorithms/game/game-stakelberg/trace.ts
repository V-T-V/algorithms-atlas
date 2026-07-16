import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stackelberg } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '斯塔克伯格: a=10 b=1 c=2', en: 'Stackelberg: a=10 b=1 c=2' }).commit();
  const r = stackelberg(10, 1, 2, {
    onLeader: (q1, q2, p1, p2) =>
      rec
        .begin({
          zh: `q1=${q1.toFixed(2)} q2=${q2.toFixed(2)}`,
          en: `q1=${q1.toFixed(2)} q2=${q2.toFixed(2)}`,
        })
        .setBars([
          { value: q1, role: 'final' as BarRole, label: 'q1' },
          { value: q2, role: 'compare' as BarRole, label: 'q2' },
        ])
        .commit(),
  });
  rec
    .begin({
      zh: `π_leader=${r.profit1.toFixed(2)} > π_follower=${r.profit2.toFixed(2)}`,
      en: `π_leader=${r.profit1.toFixed(2)} > π_follower=${r.profit2.toFixed(2)}`,
    })
    .setAux([
      { label: 'leader', value: r.profit1.toFixed(2), role: 'final' as BarRole },
      { label: 'follower', value: r.profit2.toFixed(2), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
