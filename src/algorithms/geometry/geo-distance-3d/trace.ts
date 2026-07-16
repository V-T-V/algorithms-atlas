// 三维欧氏距离 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { distance3D } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入两点', en: 'two points' }).commit();
  rec
    .begin({ zh: '距离', en: 'distance' })
    .setAux([
      {
        label: '距离',
        value: distance3D({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 2 }).toString(),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
