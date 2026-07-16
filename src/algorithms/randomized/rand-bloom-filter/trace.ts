// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BloomFilter } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (() => {
    const b = new BloomFilter(100, 3);
    b.add('x');
    return b.has('x') ? 1 : 0;
  })();
  rec
    .begin({ zh: '过滤器完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
