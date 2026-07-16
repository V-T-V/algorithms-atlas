// 向量投影 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { project } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '将 a 投影到 b', en: 'Project a onto b' }).commit();
  const r = project({ x: 3, y: 4 }, { x: 2, y: 0 });
  rec
    .begin({ zh: '投影系数 ' + r.coeff.toFixed(3), en: 'coefficient ' + r.coeff.toFixed(3) })
    .setAux([
      {
        label: '投影向量',
        value: '(' + r.vec.x.toFixed(2) + ',' + r.vec.y.toFixed(2) + ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
