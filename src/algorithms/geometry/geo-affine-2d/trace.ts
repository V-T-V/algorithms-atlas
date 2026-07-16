// 二维仿射变换 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { affine } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入点与矩阵', en: 'point and matrix' }).commit();
  rec
    .begin({ zh: '变换完成', en: 'transform done' })
    .setAux([
      {
        label: "P'",
        value:
          '(' +
          affine({ x: 1, y: 1 }, { a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 }).x +
          ',' +
          affine({ x: 1, y: 1 }, { a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 }).y +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
