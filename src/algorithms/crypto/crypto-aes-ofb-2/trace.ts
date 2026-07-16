import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ofbCrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const iv = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160];
  const pt = Array.from({ length: 32 }, (_, i) => i);
  rec
    .begin({ zh: 'AES-OFB', en: 'AES-OFB' })
    .setBars(pt.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ofbCrypt(key, iv, pt, {
    onFeedback: (fb) =>
      rec
        .begin({ zh: '反馈', en: 'feedback' })
        .setBars(fb.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit(),
  });
  return rec.build();
}
