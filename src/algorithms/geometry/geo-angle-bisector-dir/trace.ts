// 角平分线方向 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { angleBisector } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入三顶点', en: 'three vertices' }).commit();
  rec
    .begin({ zh: '角平分线方向', en: 'bisector direction' })
    .setAux([
      {
        label: '方向',
        value:
          '(' +
          angleBisector({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }).x.toFixed(2) +
          ',' +
          angleBisector({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }).y.toFixed(2) +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
