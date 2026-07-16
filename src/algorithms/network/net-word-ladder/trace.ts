import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ladderLength } from './impl.ts';
export const DEFAULT_INPUT = {
  begin: 'hit',
  end: 'cog',
  list: ['hot', 'dot', 'dog', 'lot', 'log', 'cog'],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: '单词接龙 ' + input.begin + '→' + input.end,
      en: 'Word ladder ' + input.begin + '→' + input.end,
    })
    .commit();
  const len = ladderLength(input.begin, input.end, input.list, {
    onVisit: (w, d) =>
      rec
        .begin({ zh: '访问 ' + w + ' (步 ' + d + ')', en: 'visit ' + w + ' (step ' + d + ')' })
        .setAux([{ label: 'word', value: w, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '长度 = ' + len, en: 'length = ' + len })
    .setAux([{ label: 'length', value: String(len), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
