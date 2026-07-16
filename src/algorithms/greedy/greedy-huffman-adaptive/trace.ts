import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adaptiveHuffman } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'abracadabra';
  rec.begin({ zh: `自适应哈夫曼: "${s}"`, en: `Adaptive Huffman: "${s}"` }).commit();
  const codes = adaptiveHuffman(s, {
    onSymbol: (ch, f, c) =>
      rec
        .begin({ zh: `${ch}: 频${f} 码"${c}"`, en: `${ch}: freq${f} "${c}"` })
        .setBars([{ value: f, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: `编码表 ${[...codes.entries()].map(([c, v]) => c + '=' + v).join(' ')}`,
      en: 'code table',
    })
    .setAux(
      [...codes.entries()].map(([c, v]) => ({ label: c, value: v, role: 'final' as BarRole })),
    )
    .commit();
  return rec.build();
}
