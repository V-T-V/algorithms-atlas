// 正多边形顶点 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { regularPolygon } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入 n 与半径', en: 'n and radius' }).commit();
  rec
    .begin({ zh: '生成顶点', en: 'vertices generated' })
    .setAux([
      {
        label: '顶点数',
        value: String(regularPolygon(6, 0, 0, 1).length),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
