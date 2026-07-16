import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSuffixArray } from './impl.ts';

export const DEFAULT_INPUT = 'banana';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: "${input}"`, en: `Input: "${input}"` }).commit();
  const sa = buildSuffixArray(input);
  rec
    .begin({ zh: '后缀数组', en: 'Suffix array' })
    .setAux(
      sa.map((idx, i) => ({
        label: `sa[${i}]`,
        value: `${idx}: ${input.slice(idx)}`,
        role: (i === 0 ? 'final' : 'default') as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
