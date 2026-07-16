import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brachaBroadcast } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, f: 1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Bracha n=' + input.n + ' f=' + input.f, en: 'Bracha' }).commit();
  const r = brachaBroadcast(input.n, input.f, {
    onEcho: (nd) =>
      rec
        .begin({ zh: 'N' + nd + ' ECHO', en: 'echo' })
        .setAux([{ label: 'node', value: 'N' + nd, role: 'compare' as BarRole }])
        .commit(),
    onReady: (nd) =>
      rec
        .begin({ zh: 'N' + nd + ' READY', en: 'ready' })
        .setAux([{ label: 'ready', value: 'N' + nd, role: 'pivot' as BarRole }])
        .commit(),
    onDeliver: (nd) =>
      rec
        .begin({ zh: 'N' + nd + ' DELIVER', en: 'deliver' })
        .setAux([{ label: 'deliver', value: 'N' + nd, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '投递 ' + r.delivered + '/' + input.n, en: 'delivered' })
    .setAux([{ label: 'delivered', value: String(r.delivered), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
