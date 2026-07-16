import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canonicalHuffman } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const F: ReadonlyArray<readonly [string, number]> = [
    ['a', 5],
    ['b', 9],
    ['c', 12],
    ['d', 13],
    ['e', 16],
  ];
  rec.begin({ zh: '规范哈夫曼', en: 'Canonical Huffman' }).commit();
  canonicalHuffman(F, {
    onCode: (s, len, code) =>
      rec
        .begin({ zh: `${s}: len${len} ${code}`, en: `${s}: len${len} ${code}` })
        .setBars([{ value: len, role: 'pivot' as BarRole }])
        .commit(),
  });
  return rec.build();
}
