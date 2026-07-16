// 比较版本号 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscCompareVersion } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '"1.01" vs "1.001"', en: '"1.01" vs "1.001"' }).commit();
  const r = miscCompareVersion('1.01', '1.001', {
    onSegment: (i, x, y, c) =>
      rec.begin({ zh: `段${i}: ${x} vs ${y} cmp=${c}`, en: `Seg${i}: ${x} vs ${y}` }).commit(),
  });
  rec
    .begin({ zh: `cmp=${r}`, en: `cmp=${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
