import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canReach } from './impl.ts';
export const DEFAULT_INPUT = { arr: [4, 2, 3, 0, 3, 1, 2], start: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '跳跃游戏3', en: 'Jump game III' }).commit();
  const ok = canReach(input.arr, input.start, {
    onVisit: (i) =>
      rec
        .begin({ zh: '访问 ' + i + ' (值 ' + input.arr[i] + ')', en: 'visit ' + i })
        .setAux([{ label: 'pos', value: String(i), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '可达 0？' + ok, en: 'reach 0? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
