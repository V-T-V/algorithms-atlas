import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomTournamentSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: '随机锦标赛 k=5', en: 'random tournament k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  randomTournamentSelect(data, 5, 11, {
    onRound: (pairs) =>
      rec
        .begin({ zh: `本轮 ${pairs.length} 对`, en: `${pairs.length} pairs` })
        .setAux([{ label: 'pairs', value: String(pairs.length), role: 'compare' as BarRole }])
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `第 5 小=${v}`, en: `5th=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
