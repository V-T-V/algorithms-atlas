// 三角形内心 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { incenter } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '给定三角形', en: 'given triangle' }).commit();
  const r = incenter({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 8 });
  rec
    .begin({ zh: '内心计算完成', en: 'incenter done' })
    .setAux([
      {
        label: '圆心',
        value: '(' + r.center.x.toFixed(2) + ',' + r.center.y.toFixed(2) + ')',
        role: 'final' as BarRole,
      },
      { label: '内切圆半径', value: r.radius.toFixed(3), role: 'frontier' as BarRole },
    ])
    .commit();
  return rec.build();
}
