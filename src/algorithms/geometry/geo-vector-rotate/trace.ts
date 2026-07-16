// 向量旋转 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotate } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '原始向量 (1,0)', en: 'original (1,0)' }).commit();
  const r = rotate({ x: 1, y: 0 }, Math.PI / 2);
  rec
    .begin({ zh: '逆时针旋转 90° 后', en: 'after +90° rotation' })
    .setAux([
      {
        label: '结果',
        value: '(' + r.x.toFixed(3) + ',' + r.y.toFixed(3) + ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
