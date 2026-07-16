import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zscoreOutliers, mean, std } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 100];
  const m = mean(data);
  const s = std(data, m);
  rec
    .begin({
      zh: `Z-score (μ=${m.toFixed(1)}, σ=${s.toFixed(1)})`,
      en: `Z-score (μ=${m.toFixed(1)}, σ=${s.toFixed(1)})`,
    })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  zscoreOutliers(data, 2, {
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
  return rec.build();
}
