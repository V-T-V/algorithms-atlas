import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parityWinner, type ParityGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const g: ParityGame = {
    n: 4,
    owner: ['E', 'O', 'E', 'O'],
    prio: [2, 1, 3, 0],
    succ: [[1], [0, 2], [3], [1]],
  };
  rec
    .begin({ zh: '奇偶博弈 4 节点', en: 'Parity game 4 nodes' })
    .setGraph(
      g.prio.map((p, i) => ({
        id: String(i),
        label: String(p),
        role: (p % 2 === 0 ? 'final' : 'warn') as BarRole,
      })),
      [
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 3],
        [3, 1],
      ].map((e) => ({ from: String(e[0]), to: String(e[1]) })),
    )
    .commit();
  const w = parityWinner(g, {
    onWinner: (v, win) =>
      rec
        .begin({ zh: `节点 ${v}: ${win} 胜`, en: `node ${v}: ${win} wins` })
        .setAux([
          { label: 'node', value: String(v), role: 'pivot' as BarRole },
          {
            label: 'winner',
            value: win,
            role: win === 'E' ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  void w;
  return rec.build();
}
