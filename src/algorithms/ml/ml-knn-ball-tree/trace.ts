// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ballTreeKnn } from './impl.ts';
const pts = [
  [0, 0],
  [1, 1],
  [5, 5],
  [6, 6],
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(ballTreeKnn(pts, [0.1, 0.1]) * 100) / 100;
  rec
    .begin({ zh: '球树查询完成', en: 'ball tree query done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
