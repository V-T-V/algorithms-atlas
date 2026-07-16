import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AhoCorasick } from './impl.ts';

export const DEFAULT_INPUT = { text: 'ushers', patterns: ['he', 'she', 'his', 'hers'] };

export function buildTrace(input: { text: string; patterns: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const ac = new AhoCorasick(input.patterns);
  rec
    .begin({
      zh: `文本: "${input.text}", 模式: ${input.patterns.join('/')}`,
      en: `Text: "${input.text}", patterns: ${input.patterns.join('/')}`,
    })
    .commit();
  const hits = ac.search(input.text);
  for (const h of hits) {
    rec
      .begin({ zh: `命中 "${h.pattern}" @${h.at}`, en: `match "${h.pattern}" @${h.at}` })
      .setAux([{ label: 'match', value: h.pattern, role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
