// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildCoverTree, coverTreeNearest } from './impl.ts';
const pts = [
  [0, 0],
  [1, 1],
  [5, 5],
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(coverTreeNearest(buildCoverTree(pts), [0.1, 0.1]) * 100) / 100;
  rec
    .begin({ zh: '覆盖树查询完成', en: 'cover tree done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
