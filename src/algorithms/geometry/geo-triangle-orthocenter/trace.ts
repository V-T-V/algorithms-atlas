// 三角形垂心 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { orthocenter } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '给定三角形', en: 'given triangle' }).commit();
  rec
    .begin({ zh: '垂心计算完成', en: 'orthocenter done' })
    .setAux([
      {
        label: 'H',
        value:
          '(' +
          orthocenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }).x.toFixed(2) +
          ',' +
          orthocenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }).y.toFixed(2) +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
