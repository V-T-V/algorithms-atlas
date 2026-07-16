// Huffman 编码 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyHuffman3 } from './impl.ts';
const FREQS = [
  { char: 'a', freq: 5 },
  { char: 'b', freq: 9 },
  { char: 'c', freq: 12 },
  { char: 'd', freq: 13 },
  { char: 'e', freq: 16 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'Huffman：按频率合并', en: 'Huffman: merge by frequency' })
    .setBars(FREQS.map((f) => ({ value: f.freq, role: 'default' as BarRole, label: f.char })))
    .commit();
  const r = greedyHuffman3(FREQS, {
    onMerge: (a, b, m) => {
      rec
        .begin({
          zh: `合并 ${a.char}(${a.freq}) + ${b.char}(${b.freq}) = ${m.freq}`,
          en: `Merge ${a.char}(${a.freq}) + ${b.char}(${b.freq}) = ${m.freq}`,
        })
        .setAux([{ label: '新节点', value: String(m.freq), role: 'final' as BarRole }])
        .commit();
    },
  });
  rec
    .begin({ zh: `总位数 ${r.totalBits}`, en: `Total bits ${r.totalBits}` })
    .setAux(
      Object.entries(r.codes).map(([c, code]) => ({
        label: c,
        value: code,
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
