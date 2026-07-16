import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intervalGraphColor } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const I = [
    [1, 4],
    [2, 5],
    [3, 6],
    [4, 7],
  ] as const;
  rec.begin({ zh: '区间着色', en: 'Interval coloring' }).commit();
  const c = intervalGraphColor(I, {
    onEvent: (t, ov) =>
      rec
        .begin({ zh: `t=${t} 重叠${ov}`, en: `t=${t} overlap${ov}` })
        .setBars([{ value: ov, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `最少 ${c} 色`, en: `min ${c} colors` })
    .setAux([{ label: 'colors', value: String(c), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
