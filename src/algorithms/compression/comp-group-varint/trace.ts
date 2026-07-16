import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { groupVarintEncode } from './impl.ts';
export const DEFAULT_INPUT = [1, 300, 70000, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Group-Varint', en: 'Group-Varint' }).commit();
  const out = groupVarintEncode(input, {
    onGroup: (tag, sizes) =>
      rec
        .begin({ zh: 'tag=' + tag + ' 尺寸[' + sizes.join(',') + ']', en: 'group' })
        .setAux([
          { label: 'tag', value: String(tag), role: 'pivot' as BarRole },
          { label: 'sizes', value: sizes.join(','), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: out.length + ' 字节', en: out.length + 'B' })
    .setAux([{ label: 'bytes', value: String(out.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
