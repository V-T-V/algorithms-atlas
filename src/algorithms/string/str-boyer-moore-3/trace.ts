// =============================================================================
// Boyer-Moore · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boyerMoore } from './impl.ts';

export const DEFAULT_INPUT = { text: 'HERE IS A SIMPLE EXAMPLE', pat: 'EXAMPLE' };

export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const m = pat.length;

  const found = boyerMoore(text, pat, {
    onCompare: (i, j, equal) => {
      rec
        .begin({
          zh: `比较 text[${i}]='${text[i]}' 与 pat[${j}]='${pat[j]}'`,
          en: `Compare text[${i}]='${text[i]}' vs pat[${j}]='${pat[j]}'`,
        })
        .setBars(
          text.split('').map((ch, idx) => ({
            value: ch.charCodeAt(0),
            role: idx === i ? (equal ? 'compare' : 'swap') : 'default',
          })),
        )
        .setAux([{ label: 'equal', value: String(equal), role: equal ? 'compare' : 'swap' }])
        .commit();
    },
    onFound: (start) => {
      rec
        .begin({ zh: `命中 @ ${start}`, en: `Found @ ${start}` })
        .setBars(
          text.split('').map((ch, idx) => ({
            value: ch.charCodeAt(0),
            role: idx >= start && idx < start + m ? 'final' : 'default',
          })),
        )
        .commit();
    },
  });

  rec
    .begin({ zh: `结果 = [${found.join(',')}]`, en: `Matches = [${found.join(',')}]` })
    .setBars(text.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .setAux([{ label: 'found', value: `[${found.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
