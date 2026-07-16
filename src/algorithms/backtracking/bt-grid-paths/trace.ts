import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gridPaths } from './impl.ts';
export const DEFAULT_INPUT = { R: 3, C: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec
    .begin({ zh: input.R + '×' + input.C + ' 网格路径', en: input.R + 'x' + input.C + ' paths' })
    .commit();
  gridPaths(input.R, input.C, {
    onResult: (p) =>
      rec
        .begin({ zh: p, en: p })
        .setBars([{ value: p.length, role: 'final' as BarRole, label: p }])
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
