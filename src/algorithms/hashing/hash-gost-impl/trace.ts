// hash-gost-impl · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashGostImpl } from './impl.ts';
export const DEFAULT_INPUT = 'hello';
export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  rec
    .begin({
      zh: `hash-gost-impl ${bytes.length} 字节`,
      en: `hash-gost-impl ${bytes.length} bytes`,
    })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  let r: bigint[] = [];
  hashGostImpl(input, {
    onBlock: (i) =>
      rec
        .begin({ zh: `压缩块 #${i}`, en: `Compress block #${i}` })
        .setAux([{ label: '块', value: String(i), role: 'compare' as BarRole }])
        .commit(),
    onResult: (out) => {
      r = out;
    },
  });
  const hex = r.map((x) => x.toString(16).padStart(16, '0')).join('');
  rec
    .begin({ zh: '最终哈希', en: 'Final hash' })
    .setAux([{ label: 'hex', value: hex, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
