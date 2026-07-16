import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tabulationHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'tab';
  rec.begin({ zh: `Tabulation "${s}"`, en: `Tabulation "${s}"` }).commit();
  tabulationHash(s, undefined, {
    onChar: (p, c, h) =>
      rec
        .begin({
          zh: `pos${p} char${c} -> 0x${h.toString(16)}`,
          en: `pos${p} char${c} -> 0x${h.toString(16)}`,
        })
        .setAux([{ label: 'h', value: '0x' + h.toString(16), role: 'pivot' as BarRole }])
        .commit(),
  });
  return rec.build();
}
