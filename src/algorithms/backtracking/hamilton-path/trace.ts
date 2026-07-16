import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '开始', en: 'Start' }).setBars(rec.barsFrom(input)).commit();
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(input.map((v) => ({ value: v, role: 'final' })))
    .commit();
  return rec.build();
}
