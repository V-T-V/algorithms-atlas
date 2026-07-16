import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { regexToPostfix, insertConcat } from './impl.ts';

export const DEFAULT_INPUT = '(a|b)*c';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cat = insertConcat(input);
  rec
    .begin({ zh: `插入连接: ${cat}`, en: `With concat: ${cat}` })
    .setAux([{ label: 'concat', value: cat, role: 'compare' as BarRole }])
    .commit();
  const post = regexToPostfix(input);
  rec
    .begin({ zh: `后缀: ${post}`, en: `Postfix: ${post}` })
    .setAux(post.split('').map((c, i) => ({ label: `p${i}`, value: c, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
