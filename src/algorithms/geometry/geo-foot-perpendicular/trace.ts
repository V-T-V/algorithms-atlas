// 垂足 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { footOfPerpendicular } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入点与直线', en: 'point and line' }).commit();
  rec
    .begin({ zh: '垂足计算', en: 'foot computed' })
    .setAux([
      {
        label: '垂足',
        value:
          '(' +
          footOfPerpendicular({ x: 1, y: 5 }, { a: 0, b: 1, c: 0 }).x +
          ',' +
          footOfPerpendicular({ x: 1, y: 5 }, { a: 0, b: 1, c: 0 }).y +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
