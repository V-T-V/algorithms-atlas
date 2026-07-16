import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectOutliers } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100]; // 100 是离群点
  rec
    .begin({ zh: 'Tukey 离群点', en: 'Tukey outliers' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  const out = detectOutliers(data, 1.5, {
    onFences: (lo, hi) =>
      rec
        .begin({
          zh: `栅栏 [${lo.toFixed(1)}, ${hi.toFixed(1)}]`,
          en: `fence [${lo.toFixed(1)}, ${hi.toFixed(1)}]`,
        })
        .setAux([
          {
            label: 'fence',
            value: `${lo.toFixed(1)}..${hi.toFixed(1)}`,
            role: 'compare' as BarRole,
          },
        ])
        .commit(),
    onResult: (outliers) =>
      rec
        .begin({ zh: `离群点: ${outliers.join(',')}`, en: `outliers: ${outliers.join(',')}` })
        .setBars(
          data.map((x) => ({
            value: x,
            role: (outliers.includes(x) ? 'warn' : 'final') as BarRole,
          })),
        )
        .commit(),
  });
  void out;
  return rec.build();
}
