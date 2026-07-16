// 位似变换 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { homothety } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入点与比例', en: 'point and ratio' }).commit();
  rec
    .begin({ zh: '位似结果', en: 'homothety result' })
    .setAux([
      {
        label: "P'",
        value:
          '(' +
          homothety({ x: 2, y: 0 }, { x: 0, y: 0 }, 2).x +
          ',' +
          homothety({ x: 2, y: 0 }, { x: 0, y: 0 }, 2).y +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
