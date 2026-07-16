import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canVisitAllRooms } from './impl.ts';
export const DEFAULT_INPUT = [[1], [2], [3], []];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '钥匙与房间', en: 'Keys and rooms' }).commit();
  const ok = canVisitAllRooms(input, {
    onVisit: (r) =>
      rec
        .begin({ zh: '进入房间 ' + r, en: 'enter room ' + r })
        .setAux([{ label: 'room', value: String(r), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '全部访问？' + ok, en: 'all? ' + ok })
    .setAux([{ label: 'all', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
