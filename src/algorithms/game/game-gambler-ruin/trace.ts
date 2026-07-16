import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gamblerRuin } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '赌徒破产：本金扫描', en: 'Gambler ruin: scan capital' })
    .setAux([
      { label: 'N', value: '10', role: 'default' as BarRole },
      { label: 'p', value: '0.4', role: 'pivot' as BarRole },
    ])
    .commit();
  const pts: number[] = [];
  for (let i = 0; i <= 10; i++) {
    pts.push(gamblerRuin(i, 10, 0.4));
  }
  rec
    .begin({ zh: '破产概率 vs 本金', en: 'Ruin prob vs capital' })
    .setBars(pts.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
