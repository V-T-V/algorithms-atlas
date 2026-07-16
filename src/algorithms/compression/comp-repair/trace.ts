import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { repairCompress } from './impl.ts';
export const DEFAULT_INPUT = { tokens: [1, 2, 1, 2, 1, 2, 3, 3], start: 256 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Re-Pair', en: 'Re-Pair' }).commit();
  const { tokens, rules } = repairCompress(input.tokens, input.start, {
    onReplace: (pair, s) =>
      rec
        .begin({ zh: '替换 (' + pair.replace(':', ' ') + ') -> ' + s, en: 'replace' })
        .setAux([
          { label: 'pair', value: pair, role: 'compare' as BarRole },
          { label: 'sym', value: String(s), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '结果 [' + tokens.join(',') + '] 规则' + rules.size, en: 'result' })
    .setAux([
      { label: 'tokens', value: tokens.join(','), role: 'final' as BarRole },
      { label: 'rules', value: String(rules.size), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
