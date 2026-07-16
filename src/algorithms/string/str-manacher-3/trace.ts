// =============================================================================
// Manacher · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { manacher } from './impl.ts';

export const DEFAULT_INPUT = 'babadabac';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { palindrome, start, length, radii } = manacher(input);

  rec
    .begin({
      zh: `最长回文 = '${palindrome}'（起点 ${start}, 长度 ${length}）`,
      en: `Longest palindrome = '${palindrome}' (start ${start}, length ${length})`,
    })
    .setBars(
      input.split('').map((ch, i) => ({
        value: ch.charCodeAt(0),
        role: i >= start && i < start + length ? 'final' : 'default',
      })),
    )
    .setAux([
      { label: 'palindrome', value: palindrome, role: 'final' },
      { label: 'length', value: String(length), role: 'pivot' },
    ])
    .commit();

  rec
    .begin({ zh: `半径数组 = [${radii.join(',')}]`, en: `Radii = [${radii.join(',')}]` })
    .setBars(radii.map((v) => ({ value: v, role: 'compare' })))
    .setAux([{ label: 'radii', value: `[${radii.join(',')}]`, role: 'frontier' }])
    .commit();

  return rec.build();
}
