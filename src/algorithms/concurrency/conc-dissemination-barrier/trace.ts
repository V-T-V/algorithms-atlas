import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { disseminationBarrier } from './impl.ts';
export const DEFAULT_INPUT = 8;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '传播屏障 n=' + n, en: 'Dissemination n=' + n }).commit();
  const rounds = disseminationBarrier(n, {
    onSense: (r, i, j) =>
      rec
        .begin({ zh: '轮' + r + ': T' + i + ' <-> T' + j, en: 'sense' })
        .setAux([
          { label: 'round', value: String(r), role: 'pivot' as BarRole },
          { label: 'pair', value: 'T' + i + '-T' + j, role: 'compare' as BarRole },
        ])
        .commit(),
    onComplete: (rs) =>
      rec
        .begin({ zh: '完成 ' + rs + ' 轮', en: 'complete' })
        .setAux([{ label: 'rounds', value: String(rs), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + rounds + ' 轮', en: rounds + ' rounds' })
    .setAux([{ label: 'rounds', value: String(rounds), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
