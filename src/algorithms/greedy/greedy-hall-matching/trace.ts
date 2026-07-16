import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hallTheorem } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const adj = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];
  rec.begin({ zh: 'Hall 验证 3 节点', en: 'Hall verify 3 nodes' }).commit();
  const ok = hallTheorem(adj, {
    onSubset: (S, nb, good) =>
      rec
        .begin({
          zh: `S={${S.join(',')}} 邻居${nb} ${good ? '✓' : '✗'}`,
          en: `S={${S.join(',')}} N=${nb} ${good ? 'OK' : 'BAD'}`,
        })
        .setBars([{ value: nb, role: good ? ('final' as BarRole) : ('warn' as BarRole) }])
        .commit(),
  });
  rec
    .begin({ zh: ok ? '满足 Hall' : '违反 Hall', en: ok ? 'satisfies Hall' : 'violates Hall' })
    .setAux([
      {
        label: 'Hall',
        value: ok ? 'YES' : 'NO',
        role: ok ? ('final' as BarRole) : ('warn' as BarRole),
      },
    ])
    .commit();
  return rec.build();
}
