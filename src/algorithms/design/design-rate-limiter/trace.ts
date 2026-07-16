import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TokenBucket } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let t = 0;
  const tb = new TokenBucket(3, 1, () => t, {
    onAllow: (tk) =>
      rec
        .begin({ zh: `allow tokens=${tk.toFixed(1)}`, en: '' })
        .setAux([{ label: 'tokens', value: tk.toFixed(1), role: 'final' as BarRole }])
        .commit(),
    onReject: (tk) =>
      rec
        .begin({ zh: `reject tokens=${tk.toFixed(1)}`, en: '' })
        .setAux([{ label: 'tokens', value: tk.toFixed(1), role: 'warn' as BarRole }])
        .commit(),
  });
  tb.tryAcquire();
  tb.tryAcquire();
  tb.tryAcquire();
  tb.tryAcquire();
  t += 1000;
  tb.tryAcquire();
  return rec.build();
}
