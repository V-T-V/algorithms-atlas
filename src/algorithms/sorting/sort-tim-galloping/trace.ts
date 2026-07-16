import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gallopMergeSort, type GallopHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 5, 6, 7, 8];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: GallopHooks = {
    onGallop: (side, count) => {
      rec
        .begin({
          zh: `加速：从 ${side} 侧一次取 ${count} 个`,
          en: `Gallop: take ${count} from ${side}`,
        })
        .setBars(rec.barsFrom(input))
        .commit();
    },
  };
  const result = gallopMergeSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
