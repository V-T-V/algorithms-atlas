import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tournamentBarrier } from './impl.ts';
export const DEFAULT_INPUT = 8;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '锦标赛屏障 n=' + n, en: 'Tournament n=' + n }).commit();
  const rounds = tournamentBarrier(n, {
    onMatch: (r, a, b, w) =>
      rec
        .begin({ zh: '轮' + r + ': T' + a + ' vs T' + b + ' -> T' + w, en: 'match' })
        .setAux([
          { label: 'round', value: String(r), role: 'pivot' as BarRole },
          { label: 'winner', value: 'T' + w, role: 'compare' as BarRole },
        ])
        .commit(),
    onRoot: (r) =>
      rec
        .begin({ zh: '根节点轮' + r, en: 'root' })
        .setAux([{ label: 'root', value: 'r' + r, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + rounds + ' 轮', en: rounds + ' rounds' })
    .setAux([{ label: 'rounds', value: String(rounds), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
