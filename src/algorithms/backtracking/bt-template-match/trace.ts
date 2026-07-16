import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wordPatternMatch } from './impl.ts';
export const DEFAULT_INPUT = { pattern: 'abab', s: 'redblueredblue' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '模式 "' + input.pattern + '" 匹配 "' + input.s + '"', en: 'Pattern match' })
    .commit();
  const ok = wordPatternMatch(input.pattern, input.s, {
    onMap: (ch, sub) =>
      rec
        .begin({ zh: ch + ' → "' + sub + '"', en: ch + ' → "' + sub + '"' })
        .setAux([{ label: ch, value: sub, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '匹配？' + ok, en: 'match? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
