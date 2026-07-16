// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { silhouette } from './impl.ts';
const pts = [
  [0, 0],
  [0.1, 0.1],
  [5, 5],
  [5.1, 5.1],
];
const labels = [0, 0, 1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(silhouette(pts, labels).score * 1000) / 1000;
  rec
    .begin({ zh: '聚类评分', en: 'cluster score' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
