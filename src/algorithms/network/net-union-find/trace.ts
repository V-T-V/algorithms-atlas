import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { UnionFind } from './impl.ts';
export const DEFAULT_INPUT = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  unions: [
    ['A', 'B'],
    ['C', 'D'],
    ['B', 'C'],
  ],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const uf = new UnionFind(input.nodes);
  rec.begin({ zh: '并查集', en: 'Union-Find' }).commit();
  for (const [a, b] of input.unions)
    uf.union(a!, b!, {
      onUnion: (x, y) =>
        rec
          .begin({ zh: 'union(' + x + ',' + y + ')', en: 'union(' + x + ',' + y + ')' })
          .setAux([{ label: 'union', value: x + ',' + y, role: 'pivot' as BarRole }])
          .commit(),
    });
  rec
    .begin({ zh: '集合数 = ' + uf.count(), en: 'sets = ' + uf.count() })
    .setAux([{ label: 'count', value: String(uf.count()), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
