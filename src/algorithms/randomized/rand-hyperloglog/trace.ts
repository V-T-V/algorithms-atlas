// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HyperLogLogLite } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (() => {
    const h = new HyperLogLogLite();
    for (let i = 0; i < 100; i++) h.add(i);
    return h.estimate();
  })();
  rec
    .begin({ zh: '估计完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
