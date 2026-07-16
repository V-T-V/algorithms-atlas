import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ServiceLocator } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const loc = new ServiceLocator({
    onRegister: (k) =>
      rec
        .begin({ zh: `register ${k}`, en: `register ${k}` })
        .setAux([{ label: 'key', value: k, role: 'compare' as BarRole }])
        .commit(),
    onResolve: (k, cached) =>
      rec
        .begin({ zh: `resolve ${k} ${cached ? '(cached)' : '(new)'}`, en: '' })
        .setAux([
          {
            label: 'cached',
            value: String(cached),
            role: cached ? 'final' : ('compare' as BarRole),
          },
        ])
        .commit(),
  });
  loc.register('db', () => ({ query: '...' }));
  loc.resolve('db');
  loc.resolve('db');
  return rec.build();
}
