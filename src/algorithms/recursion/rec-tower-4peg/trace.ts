// rec-tower-4peg · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recTower4peg } from './impl.ts';
export const DEFAULT_INPUT = { n: 4 };
export function buildTrace(input: { n?: number } = {}): Frame[] {
  const { n = 4 } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '4柱汉诺塔开始', en: '4-peg Hanoi start' }).commit();
  const r = recTower4peg(n);
  rec
    .begin({ zh: `完成，共 ${r.moves.length} 步`, en: `Done in ${r.moves.length} moves` })
    .setAux([
      { label: 'moves', value: String(r.moves.length), role: 'final' as BarRole },
      { label: 'depth', value: String(r.depth), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
