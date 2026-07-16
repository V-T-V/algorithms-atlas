// =============================================================================
// KMP · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kmp4, prefixFunction } from './impl.ts';

export const DEFAULT_INPUT = { text: 'ABABDABACDABABCABAB', pat: 'ABABCABAB' };

export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const pi = prefixFunction(pat);

  rec
    .begin({ zh: `前缀函数 pi = [${pi.join(',')}]`, en: `Prefix function pi = [${pi.join(',')}]` })
    .setBars(pi.map((v) => ({ value: v, role: 'default' })))
    .setAux([{ label: 'pi', value: `[${pi.join(',')}]`, role: 'pivot' }])
    .commit();

  const found = kmp4(text, pat, {
    onCompare: (i, j, equal) => {
      const textBars = text.split('').map((ch, idx) => ({
        value: ch.charCodeAt(0),
        role: (idx === i ? (equal ? 'compare' : 'swap') : 'default') as BarRole,
      }));
      rec
        .begin({
          zh: `比较 text[${i}]='${text[i]}' 与 pat[${j}]`,
          en: `Compare text[${i}]='${text[i]}' vs pat[${j}]`,
        })
        .setBars(textBars)
        .setAux([
          { label: 'equal', value: String(equal), role: (equal ? 'compare' : 'swap') as BarRole },
        ])
        .commit();
    },
    onFound: (start) => {
      rec
        .begin({ zh: `命中 @ ${start}`, en: `Found @ ${start}` })
        .setBars(
          text.split('').map((ch, idx) => ({
            value: ch.charCodeAt(0),
            role: (idx >= start && idx < start + pat.length ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  });

  rec
    .begin({ zh: `匹配结果 = [${found.join(',')}]`, en: `Matches = [${found.join(',')}]` })
    .setBars(text.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .setAux([{ label: 'found', value: `[${found.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
