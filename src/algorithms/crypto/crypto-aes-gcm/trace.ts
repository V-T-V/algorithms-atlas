import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gcmEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i);
  const iv = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const pt = Array.from({ length: 32 }, (_, i) => (i * 7) & 0xff);
  rec
    .begin({ zh: 'AES-GCM', en: 'AES-GCM' })
    .setBars(pt.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  gcmEncrypt(key, iv, pt, [], {
    onCtr: (c, ks) =>
      rec
        .begin({
          zh: `CTR ${c
            .slice(12, 16)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')}`,
          en: '',
        })
        .setBars(ks.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit(),
    onTag: (t) =>
      rec
        .begin({ zh: '认证标签', en: 'auth tag' })
        .setBars(t.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}
