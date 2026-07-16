// =============================================================================
// 后缀数组 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSuffixArray } from './impl.ts';

export const DEFAULT_INPUT = 'banana';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { sa, height } = buildSuffixArray(input);

  for (let i = 0; i < sa.length; i++) {
    const suffix = input.slice(sa[i]!);
    rec
      .begin({ zh: `SA[${i}] = ${sa[i]} → '${suffix}'`, en: `SA[${i}] = ${sa[i]} → '${suffix}'` })
      .setBars(
        input.split('').map((ch, idx) => ({
          value: ch.charCodeAt(0),
          role: idx >= sa[i]! ? 'final' : 'default',
        })),
      )
      .setAux([
        { label: 'sa', value: `[${sa.join(',')}]`, role: 'frontier' },
        { label: 'height', value: `[${height.join(',')}]`, role: 'pivot' },
      ])
      .commit();
  }

  rec
    .begin({ zh: '构造完成', en: 'Done' })
    .setBars(height.map((h) => ({ value: h, role: 'compare' })))
    .setAux([
      { label: 'sa', value: `[${sa.join(',')}]`, role: 'final' },
      { label: 'height', value: `[${height.join(',')}]`, role: 'final' },
    ])
    .commit();

  return rec.build();
}
