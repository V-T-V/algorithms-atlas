import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { strandSort2, type Strand2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: Strand2Hooks = {
    onStrand: (strand, result) => {
      rec
        .begin({
          zh: `抽出 strand [${strand.join(',')}] → 归并后结果`,
          en: `Strand [${strand.join(',')}] merged`,
        })
        .setBars(result.map((v) => ({ value: v, role: 'frontier' as BarRole })))
        .commit();
    },
  };
  const r = strandSort2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(r.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
