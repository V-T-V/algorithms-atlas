import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { patienceSort3, type Patience3Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  let maxPiles = 0;
  const hooks: Patience3Hooks = {
    onPile: (pileCount) => {
      maxPiles = Math.max(maxPiles, pileCount);
    },
  };
  const result = patienceSort3(input, hooks);
  rec
    .begin({ zh: `完成（最多 ${maxPiles} 堆）`, en: `Done (max ${maxPiles} piles)` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
