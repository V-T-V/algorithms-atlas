import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ConfigManager } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const cm = new ConfigManager(
    { port: 8080 },
    {
      onSet: (k, o, n) =>
        rec
          .begin({ zh: `set ${k}: ${String(o)} → ${String(n)}`, en: '' })
          .setAux([{ label: k, value: String(n), role: 'final' as BarRole }])
          .commit(),
    },
  );
  cm.onChange('port', (v) =>
    rec
      .begin({ zh: `notify port=${v}`, en: '' })
      .setAux([{ label: 'port', value: String(v), role: 'compare' as BarRole }])
      .commit(),
  );
  cm.set('port', 9090);
  return rec.build();
}
