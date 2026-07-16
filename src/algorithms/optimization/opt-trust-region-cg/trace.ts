import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trustRegionCg } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => (x[0]! - 1) ** 2 + (x[1]! - 1) ** 2;
  const g = (x: readonly number[]) => [2 * (x[0]! - 1), 2 * (x[1]! - 1)];
  const h = () => [
    [2, 0],
    [0, 2],
  ];
  rec.begin({ zh: '信赖域 CG', en: 'Trust region CG' }).commit();
  const r = trustRegionCg(f, g, h, [0, 0], 30, {
    onIter: (i, x, fx) =>
      rec
        .begin({ zh: `${i}: [${x.map((v) => v.toFixed(3)).join(',')}] f=${fx.toFixed(4)}`, en: '' })
        .setBars([{ value: fx, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `min ≈ [${r.x.map((v) => v.toFixed(3)).join(',')}] f=${r.fx.toFixed(4)}`, en: '' })
    .commit();
  return rec.build();
}
