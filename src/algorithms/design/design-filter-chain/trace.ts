import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { applyFilters } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  applyFilters(
    { user: 'bob', age: 17 },
    [
      (r) => ({ ok: !!r.user, reason: r.user ? undefined : 'no user' }),
      (r) => ({ ok: r.age >= 18, reason: r.age >= 18 ? undefined : 'underage' }),
    ],
    {
      onFilter: (i, ok, reason) =>
        rec
          .begin({ zh: `filter[${i}] ${ok ? 'pass' : 'reject'}`, en: '' })
          .setAux([
            {
              label: ok ? 'pass' : 'reject',
              value: reason ?? '',
              role: ok ? 'final' : ('warn' as BarRole),
            },
          ])
          .commit(),
    },
  );
  return rec.build();
}
