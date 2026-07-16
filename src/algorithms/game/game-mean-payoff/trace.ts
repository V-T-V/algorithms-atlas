import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { meanPayoff } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number, number]> = [
    [0, 1, 1],
    [1, 2, 2],
    [2, 0, 3],
    [1, 0, -1],
  ];
  rec
    .begin({ zh: '均值收益：3 节点图', en: 'Mean payoff: 3-node graph' })
    .setGraph(
      [{ id: '0' }, { id: '1' }, { id: '2' }],
      E.map((e) => ({ from: String(e[0]), to: String(e[1]), weight: e[2] })),
    )
    .commit();
  const v = meanPayoff(3, E, {
    onConclude: (m) =>
      rec
        .begin({ zh: `最大圈均值 ${m.toFixed(2)}`, en: `Max cycle mean ${m.toFixed(2)}` })
        .setBars([{ value: m, role: 'final' as BarRole, label: 'mean' }])
        .commit(),
  });
  void v;
  return rec.build();
}
