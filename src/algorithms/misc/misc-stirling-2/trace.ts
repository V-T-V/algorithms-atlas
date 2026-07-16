import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stirling2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Stirling S(5,k)', en: 'Stirling S(5,k)' }).commit();
  const dp = stirling2(5, 5, {
    onConclude: () =>
      rec
        .begin({ zh: dp[5]!.join(','), en: dp[5]!.join(',') })
        .setBars(dp[5]!.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  void dp;
  return rec.build();
}
