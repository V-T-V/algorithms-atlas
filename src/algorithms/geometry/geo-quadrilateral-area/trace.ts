// 四边形面积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quadrilateralArea } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入四点', en: 'four points' }).commit();
  rec
    .begin({ zh: '鞋带面积', en: 'shoelace area' })
    .setAux([
      {
        label: '面积',
        value: quadrilateralArea(
          { x: 0, y: 0 },
          { x: 4, y: 0 },
          { x: 4, y: 3 },
          { x: 0, y: 3 },
        ).toString(),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
