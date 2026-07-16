import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { skiplistGreedy } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let seed = 42;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  rec.begin({ zh: '跳表分层 n=12 p=0.5', en: 'Skip list leveling n=12 p=0.5' }).commit();
  const r = skiplistGreedy(12, 0.5, rng, {
    onLevel: (node, lv) =>
      rec
        .begin({ zh: `节点${node} 层${lv}`, en: `node${node} level${lv}` })
        .setBars([{ value: lv, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `最高层 ${r.maxLevel}`, en: `max level ${r.maxLevel}` })
    .setBars(r.levels.map((l) => ({ value: l, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
