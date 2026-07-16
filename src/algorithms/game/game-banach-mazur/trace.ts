import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { banachMazur } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'Banach-Mazur: 目标 [0.4,0.6]', en: 'Banach-Mazur: target [0.4,0.6]' })
    .setAux([{ label: 'target', value: '[0.4,0.6]', role: 'pivot' as BarRole }])
    .commit();
  const w = banachMazur(8, 0.4, 0.6, {
    onMove: (p, lo, hi) =>
      rec
        .begin({
          zh: `${p}: [${lo.toFixed(3)},${hi.toFixed(3)}]`,
          en: `${p}: [${lo.toFixed(3)},${hi.toFixed(3)}]`,
        })
        .setBars([
          { value: lo, role: 'compare' as BarRole },
          { value: hi, role: 'compare' as BarRole },
        ])
        .commit(),
    onResult: (inT, win) =>
      rec
        .begin({ zh: `${win} 胜 (在目标内: ${inT})`, en: `${win} wins (in target: ${inT})` })
        .setAux([{ label: 'winner', value: win, role: 'final' as BarRole }])
        .commit(),
  });
  void w;
  return rec.build();
}
