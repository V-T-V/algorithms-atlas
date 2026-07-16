// 中垂线 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { perpendicularBisector } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入线段', en: 'input segment' }).commit();
  rec
    .begin({ zh: '中垂线方程', en: 'bisector equation' })
    .setAux([
      {
        label: '方程',
        value: JSON.stringify(perpendicularBisector({ x: 0, y: 0 }, { x: 2, y: 0 })),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
