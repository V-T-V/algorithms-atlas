import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { basicPaxos } from './impl.ts';
export const DEFAULT_INPUT = { acceptors: 5, value: 42 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Paxos acceptors=' + input.acceptors, en: 'Paxos' }).commit();
  const { chosen } = basicPaxos(input.acceptors, input.value, {
    onPrepare: () =>
      rec
        .begin({ zh: 'Prepare', en: 'prepare' })
        .setAux([{ label: 'phase', value: 'prepare', role: 'pivot' as BarRole }])
        .commit(),
    onPromise: (a) =>
      rec
        .begin({ zh: 'Acceptor' + a + ' Promise', en: 'promise' })
        .setAux([{ label: 'acc', value: 'A' + a, role: 'compare' as BarRole }])
        .commit(),
    onChosen: (v) =>
      rec
        .begin({ zh: '选定 ' + v, en: 'chosen' })
        .setAux([{ label: 'chosen', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'chosen=' + chosen, en: 'chosen' })
    .setAux([{ label: 'chosen', value: String(chosen), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
