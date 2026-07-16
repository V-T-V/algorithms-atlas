// rec-tower-3peg · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recTower3peg } from './impl.ts';
export const DEFAULT_INPUT = { n: 3 };
export function buildTrace(input: { n?: number } = {}): Frame[] {
  const { n = 3 } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '3柱汉诺塔开始', en: '3-peg Hanoi start' }).commit();
  const events: Array<{
    note: { zh: string; en: string };
    aux: Array<{ label: string; value: string; role?: BarRole }>;
  }> = [];
  const r = recTower3peg(n, {
    onMove: (d, disk, from, to) =>
      events.push({
        note: { zh: `移动盘 ${disk}: ${from}→${to}`, en: `move disk ${disk}: ${from}->${to}` },
        aux: [
          { label: 'disk', value: String(disk), role: 'pivot' as BarRole },
          { label: 'from', value: String(from), role: 'compare' as BarRole },
          { label: 'to', value: String(to), role: 'final' as BarRole },
        ],
      }),
    onBase: (d, disk, from, to) =>
      events.push({
        note: { zh: `基线: 盘 ${disk} ${from}→${to}`, en: `base: disk ${disk} ${from}->${to}` },
        aux: [],
      }),
  });
  for (const ev of events) rec.begin(ev.note).setAux(ev.aux).commit();
  rec
    .begin({ zh: `完成，共 ${r.moves.length} 步`, en: `Done in ${r.moves.length} moves` })
    .setAux([{ label: 'moves', value: String(r.moves.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
