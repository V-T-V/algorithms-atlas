// 多边形凸性判定 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isConvex } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入多边形', en: 'input polygon' }).commit();
  rec
    .begin({ zh: '凸性判定完成', en: 'convexity checked' })
    .setAux([
      {
        label: '凸?',
        value: String(
          isConvex([
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 4, y: 3 },
            { x: 0, y: 3 },
          ]),
        ),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
