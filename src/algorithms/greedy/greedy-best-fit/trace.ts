import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bestFitBinPacking } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = [5, 3, 7, 2, 4];
  rec.begin({ zh: '最佳适应 capacity=10', en: 'Best fit capacity=10' }).commit();
  const n = bestFitBinPacking(items, 10, {
    onPlace: (it, bin, load) =>
      rec
        .begin({
          zh: `物品${it} -> 箱${bin} (载${load})`,
          en: `item${it} -> bin${bin} (load${load})`,
        })
        .setBars([{ value: load, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `${n} 个箱子`, en: `${n} bins` }).commit();
  return rec.build();
}
