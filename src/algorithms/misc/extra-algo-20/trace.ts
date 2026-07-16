import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extraalgo20 } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入', en: 'Input' }).setBars(rec.barsFrom(input)).commit();
  const result = extraalgo20(input);
  rec
    .begin({ zh: '结果', en: 'Result' })
    .setAux([{ label: 'sum', value: String(result), role: 'final' }])
    .commit();
  return rec.build();
}
