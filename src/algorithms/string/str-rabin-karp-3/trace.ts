// =============================================================================
// Rabin-Karp · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinKarp } from './impl.ts';

export const DEFAULT_INPUT = { text: 'AABAACAADAABAABA', pat: 'AABA' };

export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const m = pat.length;

  const found = rabinKarp(text, pat, {
    onCandidate: (i) => {
      rec
        .begin({ zh: `位置 ${i} 哈希匹配，校验字符`, en: `Pos ${i} hash match, verifying` })
        .setBars(
          text.split('').map((ch, idx) => ({
            value: ch.charCodeAt(0),
            role: idx >= i && idx < i + m ? 'compare' : 'default',
          })),
        )
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
    .begin({ zh: `匹配结果 = [${found.join(',')}]`, en: `Matches = [${found.join(',')}]` })
    .setBars(text.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .setAux([{ label: 'found', value: `[${found.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
