import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctrCrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const nonce = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
  const pt = Array.from({ length: 48 }, (_, i) => (i * 3) & 0xff);
  rec
    .begin({ zh: 'AES-CTR', en: 'AES-CTR' })
    .setBars(pt.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ctrCrypt(key, nonce, pt, {
    onStream: (ks) =>
      rec
        .begin({ zh: '密钥流块', en: 'keystream' })
        .setBars(ks.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit(),
  });
  return rec.build();
}
