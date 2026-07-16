import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pjwHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'elf_symbol';
  rec.begin({ zh: `PJW ELF "${s}"`, en: `PJW ELF "${s}"` }).commit();
  pjwHash(s, {
    onByte: (i, b, h) =>
      rec
        .begin({ zh: `[${i}]=${b} h=0x${h.toString(16)}`, en: `[${i}]=${b} h=0x${h.toString(16)}` })
        .setAux([{ label: 'h', value: '0x' + h.toString(16), role: 'pivot' as BarRole }])
        .commit(),
  });
  return rec.build();
}
