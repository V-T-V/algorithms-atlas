// 三角形带符号面积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { signedArea } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '给定三点', en: 'three points' }).commit();
  rec
    .begin({ zh: '带符号面积 = 叉积/2', en: 'signed area = cross/2' })
    .setAux([
      {
        label: '面积',
        value: String(signedArea({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 })),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
