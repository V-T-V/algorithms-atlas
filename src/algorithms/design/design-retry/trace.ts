import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { retry } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let attempt = 0;
  void retry(
    async () => {
      attempt++;
      if (attempt < 3) throw new Error('x');
      return 'ok';
    },
    { maxAttempts: 5, baseDelayMs: 10, maxDelayMs: 100, jitter: 0 },
    {
      onAttempt: (a) =>
        rec
          .begin({ zh: `attempt ${a}`, en: `attempt ${a}` })
          .setAux([{ label: 'attempt', value: String(a), role: 'compare' as BarRole }])
          .commit(),
      onFail: (a) =>
        rec
          .begin({ zh: `fail ${a}`, en: '' })
          .setAux([{ label: 'fail', value: String(a), role: 'warn' as BarRole }])
          .commit(),
      onBackoff: (a, d) =>
        rec
          .begin({ zh: `backoff ${a} → ${d}ms`, en: '' })
          .setAux([{ label: 'delay', value: String(d), role: 'compare' as BarRole }])
          .commit(),
      onSuccess: (a) =>
        rec
          .begin({ zh: `success @${a}`, en: '' })
          .setAux([{ label: 'success', value: String(a), role: 'final' as BarRole }])
          .commit(),
    },
    async () => {
      /* no real sleep */
    },
  );
  return rec.build();
}
