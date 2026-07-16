import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simple9Encode } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Simple9', en: 'Simple9' }).commit();
  const words = simple9Encode(input, {
    onWord: (sel, cnt) =>
      rec
        .begin({ zh: '选择器 ' + sel + ' 数量 ' + cnt, en: 'word' })
        .setAux([
          { label: 'sel', value: String(sel), role: 'pivot' as BarRole },
          { label: 'cnt', value: String(cnt), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: words.length + ' 字', en: words.length + ' words' })
    .setAux([{ label: 'words', value: String(words.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
