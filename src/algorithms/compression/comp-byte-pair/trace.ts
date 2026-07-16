import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bytePairEncode, bytePairDecode } from './impl.ts';
export const DEFAULT_INPUT = { tokens: [97, 97, 98, 97, 97, 98, 99], vocab: 256, rounds: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BPE', en: 'BPE' }).commit();
  const { tokens, rules } = bytePairEncode(input.tokens, input.vocab, input.rounds, {
    onMerge: (pair, sym) =>
      rec
        .begin({ zh: '合并 (' + pair + ') -> ' + sym, en: 'merge' })
        .setAux([
          { label: 'pair', value: '(' + pair + ')', role: 'compare' as BarRole },
          { label: 'sym', value: String(sym), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '结果 [' + tokens.join(',') + ']', en: 'result' })
    .setAux([
      { label: 'tokens', value: tokens.join(','), role: 'final' as BarRole },
      { label: 'dec', value: bytePairDecode(tokens, rules).join(','), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
