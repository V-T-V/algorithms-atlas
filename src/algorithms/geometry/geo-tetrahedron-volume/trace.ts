// 四面体体积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tetrahedronVolume } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入四点', en: 'four points' }).commit();
  rec
    .begin({ zh: '体积 = |det|/6', en: 'volume = |det|/6' })
    .setAux([
      {
        label: '体积',
        value: tetrahedronVolume(
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 0, z: 0 },
          { x: 0, y: 1, z: 0 },
          { x: 0, y: 0, z: 1 },
        ).toFixed(4),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
