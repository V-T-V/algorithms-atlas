// 三角形外心 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circumcenter } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '给定三角形三点', en: 'three triangle vertices' }).commit();
  const r = circumcenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  rec
    .begin({
      zh: '外心 (' + r.center.x.toFixed(2) + ',' + r.center.y.toFixed(2) + ')',
      en: 'circumcenter computed',
    })
    .setAux([
      {
        label: '圆心',
        value: '(' + r.center.x.toFixed(2) + ',' + r.center.y.toFixed(2) + ')',
        role: 'final' as BarRole,
      },
      { label: '半径', value: r.radius.toFixed(3), role: 'frontier' as BarRole },
    ])
    .commit();
  return rec.build();
}
