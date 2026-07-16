import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { firstFitDecreasing } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = [4, 8, 1, 4, 2, 1];
  rec.begin({ zh: 'FFD 装箱 capacity=10', en: 'FFD bin packing capacity=10' }).commit();
  const n = firstFitDecreasing(items, 10, {
    onPlace: (it, bin, load) =>
      rec
        .begin({
          zh: `物品${it} -> 箱${bin} (载${load})`,
          en: `item${it} -> bin${bin} (load${load})`,
        })
        .setBars([{ value: load, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `${n} 个箱子`, en: `${n} bins` })
    .setBars([{ value: n, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
