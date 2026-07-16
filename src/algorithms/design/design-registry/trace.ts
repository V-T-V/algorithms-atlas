import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Registry } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const reg = new Registry<string>({
    onRegister: (n) =>
      rec
        .begin({ zh: `register '${n}'`, en: `register '${n}'` })
        .setAux([{ label: 'name', value: n, role: 'compare' as BarRole }])
        .commit(),
    onLookup: (n, f) =>
      rec
        .begin({ zh: `lookup '${n}' → ${f ? '命中' : '未命中'}`, en: '' })
        .setAux([{ label: 'found', value: String(f), role: f ? 'final' : ('warn' as BarRole) }])
        .commit(),
  });
  reg.register('a', 'A1');
  reg.register('b', 'B1');
  reg.lookup('a');
  reg.lookup('z');
  return rec.build();
}
