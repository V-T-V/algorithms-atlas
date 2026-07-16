// Dota2 参议院 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyDota2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'senate="RD"', en: 'senate="RD"' }).commit();
  const r = greedyDota2('RDD', {
    onRound: (rd) => rec.begin({ zh: `第 ${rd} 轮`, en: `Round ${rd}` }).commit(),
  });
  rec
    .begin({ zh: `胜者 ${r.winner}`, en: `Winner ${r.winner}` })
    .setAux([{ label: '胜者', value: r.winner, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
