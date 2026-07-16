// Manacher 最长回文 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestPalindrome } from './impl.ts';

export const DEFAULT_INPUT = 'babad';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chars = [...input];

  rec
    .begin({ zh: `原串：${input}`, en: `Input string: ${input}` })
    .setAux(chars.map((char, index) => ({ label: String(index), value: char, role: 'default' })))
    .commit();

  const out = longestPalindrome(input, {
    onUpdateMax: (center, radius, length) => {
      rec
        .begin({
          zh: `中心 ${center} 更新最长回文，长度 ${length}`,
          en: `Center ${center} updates best palindrome, length ${length}`,
        })
        .setAux([
          { label: 'center', value: String(center), role: 'compare' },
          { label: 'radius', value: String(radius), role: 'frontier' },
          { label: 'best length', value: String(length), role: 'final' },
        ])
        .commit();
    },
  });
  const best = input.slice(out.start, out.start + out.length);

  rec
    .begin({ zh: `最长回文：${best}`, en: `Longest palindrome: ${best}` })
    .setAux([
      { label: 'start', value: String(out.start), role: 'default' },
      { label: 'length', value: String(out.length), role: 'default' },
      { label: 'substring', value: best, role: 'final' },
    ])
    .commit();

  return rec.build();
}
