import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { keccakSponge } from './impl.ts';
export const DEFAULT_INPUT: any = { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rate: 4, outLen: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Keccak 海绵', en: 'Keccak Sponge' }).commit();
  const out = keccakSponge(input.data, input.rate, input.outLen, {
    onAbsorb: (b, st) =>
      rec
        .begin({ zh: '吸收块 ' + b, en: 'absorb' })
        .setAux([{ label: 'block', value: String(b), role: 'compare' as BarRole }])
        .commit(),
    onSqueeze: (st) =>
      rec
        .begin({ zh: '挤压', en: 'squeeze' })
        .setAux([{ label: 'squeeze', value: 'ok', role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' })
    .setAux([{ label: 'out', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
