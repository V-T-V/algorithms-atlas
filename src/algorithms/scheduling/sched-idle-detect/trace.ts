import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectIdle, type Segment } from './impl.ts';
export const DEFAULT_INPUT = {
  segments: [
    { id: 'A', start: 0, end: 3 },
    { id: 'B', start: 5, end: 7 },
  ] as Segment[],
  total: 8,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '空闲检测', en: 'Idle detect' }).commit();
  const idles = detectIdle(input.segments, input.total, {
    onIdle: (i) =>
      rec
        .begin({ zh: '空闲 ' + i.start + '-' + i.end, en: 'idle ' + i.start + '-' + i.end })
        .setBars([{ value: i.end - i.start, role: 'warn' as BarRole, label: 'idle' }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + idles.length + ' 段空闲', en: idles.length + ' idles' })
    .setAux([{ label: 'count', value: String(idles.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
