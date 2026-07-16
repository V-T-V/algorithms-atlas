// 点关于点反射 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reflectAboutPoint } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入 P 与中心 C', en: 'P and center C' }).commit();
  rec
    .begin({ zh: '中心对称点', en: 'centrally symmetric point' })
    .setAux([
      {
        label: "P'",
        value:
          '(' +
          reflectAboutPoint({ x: 1, y: 2 }, { x: 0, y: 0 }).x +
          ',' +
          reflectAboutPoint({ x: 1, y: 2 }, { x: 0, y: 0 }).y +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
