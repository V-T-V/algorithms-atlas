import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nimStrategy } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const piles = [5, 5, 5];
  rec
    .begin({ zh: `Nim [${piles.join(',')}]`, en: `Nim [${piles.join(',')}]` })
    .setBars(piles.map((p) => ({ value: p, role: 'default' as BarRole })))
    .commit();
  const r = nimStrategy(piles, {
    onConclude: (fw, p, t) =>
      rec
        .begin({ zh: fw ? `从堆${p}取${t}` : '必败', en: fw ? `pile${p} take${t}` : 'lose' })
        .setAux([
          {
            label: 'firstWins',
            value: fw ? 'YES' : 'NO',
            role: fw ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit(),
  });
  void r;
  return rec.build();
}
