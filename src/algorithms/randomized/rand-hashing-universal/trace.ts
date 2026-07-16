// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { UniversalHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = new UniversalHash(10, 42).hash(5);
  rec
    .begin({ zh: '哈希完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
