import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { blowfishEncryptBlock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x23, 0x45, 0x67, 0x89];
  const block = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef];
  rec
    .begin({ zh: 'Blowfish', en: 'Blowfish' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  blowfishEncryptBlock(key, block, {
    onEncrypt: (l, r) =>
      rec
        .begin({ zh: '加密结果', en: 'result' })
        .setAux([
          { label: 'L', value: l.toString(16), role: 'compare' as BarRole },
          { label: 'R', value: r.toString(16), role: 'final' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
