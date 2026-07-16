// 计数质数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscCountPrime2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=10', en: 'n=10' }).commit();
  const r = miscCountPrime2(10, {
    onMark: (p) => rec.begin({ zh: `筛 ${p}`, en: `Sieve ${p}` }).commit(),
  });
  rec
    .begin({ zh: `${r} 个质数`, en: `${r} primes` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
