import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyBipartiteMatch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
    [2, 0],
  ];
  rec
    .begin({ zh: '贪心二分匹配', en: 'Greedy bipartite match' })
    .setGraph(
      [{ id: 'L0' }, { id: 'L1' }, { id: 'L2' }, { id: 'R0' }, { id: 'R1' }, { id: 'R2' }],
      E.map((e) => ({ from: 'L' + e[0], to: 'R' + e[1] })),
    )
    .commit();
  const sz = greedyBipartiteMatch(E, {
    onEdge: (u, v, t) =>
      rec
        .begin({
          zh: `(L${u},R${v}) ${t ? '选入' : '跳过'}`,
          en: `(L${u},R${v}) ${t ? 'match' : 'skip'}`,
        })
        .setAux([
          {
            label: 'edge',
            value: `${u},${v}`,
            role: t ? ('final' as BarRole) : ('default' as BarRole),
          },
        ])
        .commit(),
  });
  rec
    .begin({ zh: `匹配大小 ${sz}`, en: `match size ${sz}` })
    .setBars([{ value: sz, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
