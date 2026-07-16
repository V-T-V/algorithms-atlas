import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FeatureFlags } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ff = new FeatureFlags({
    onEval: (k, e, reason) =>
      rec
        .begin({ zh: `${k} → ${e ? 'on' : 'off'} (${reason})`, en: '' })
        .setAux([{ label: k, value: String(e), role: e ? 'final' : ('warn' as BarRole) }])
        .commit(),
  });
  ff.setBoolean('new-ui', true);
  ff.setPercent('exp', 30);
  ff.isEnabled('new-ui');
  ff.isEnabled('exp', 'user-1');
  ff.isEnabled('exp', 'user-99');
  ff.isEnabled('missing');
  return rec.build();
}
