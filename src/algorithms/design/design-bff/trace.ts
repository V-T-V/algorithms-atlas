import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Bff } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bff = new Bff(
    async (svc) => {
      rec
        .begin({ zh: `fetch ${svc}`, en: `fetch ${svc}` })
        .setAux([{ label: 'svc', value: svc, role: 'compare' as BarRole }])
        .commit();
      if (svc === 'user') return { id: '1', name: 'alice' };
      if (svc === 'orders') return [{ id: 'o1' }, { id: 'o2' }];
      return [{ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }];
    },
    {
      onAggregate: (shape) =>
        rec
          .begin({ zh: `aggregate → ${shape}`, en: `aggregate → ${shape}` })
          .setAux([{ label: 'shape', value: shape, role: 'final' as BarRole }])
          .commit(),
    },
  );
  void bff.webView('1');
  return rec.build();
}
