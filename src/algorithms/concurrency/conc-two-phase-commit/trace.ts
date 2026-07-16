import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoPhaseCommit } from './impl.ts';
export const DEFAULT_INPUT = { participants: 3, votes: [true, true, true] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2PC participants=' + input.participants, en: '2PC' }).commit();
  const r = twoPhaseCommit(input.participants, input.votes, {
    onVote: (p, yes) =>
      rec
        .begin({ zh: 'P' + p + ' ' + (yes ? 'YES' : 'NO'), en: 'vote' })
        .setAux([
          { label: 'p', value: 'P' + p, role: 'compare' as BarRole },
          { label: 'vote', value: yes ? 'YES' : 'NO', role: 'pivot' as BarRole },
        ])
        .commit(),
    onCommit: () =>
      rec
        .begin({ zh: 'COMMIT', en: 'commit' })
        .setAux([{ label: 'result', value: 'commit', role: 'final' as BarRole }])
        .commit(),
    onAbort: () =>
      rec
        .begin({ zh: 'ABORT', en: 'abort' })
        .setAux([{ label: 'result', value: 'abort', role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 ' + r, en: r })
    .setAux([{ label: 'result', value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
