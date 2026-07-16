import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lookAndSay } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '外观数列', en: 'Look-and-say' }).commit();
  const terms = lookAndSay('1', 6, {
    onTerm: (i, t) =>
      rec
        .begin({ zh: `第${i}项: ${t}`, en: `term${i}: ${t}` })
        .setAux([{ label: 'len', value: String(t.length), role: 'final' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `${terms.length} 项`, en: `${terms.length} terms` }).commit();
  return rec.build();
}
