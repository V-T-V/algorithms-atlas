import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { raftLeaderElection } from './impl.ts';
export const DEFAULT_INPUT = { nodes: 5, candidate: 1, votes: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Raft 选主 nodes=' + input.nodes, en: 'Raft' }).commit();
  const r = raftLeaderElection(input.nodes, input.candidate, input.votes, {
    onCandidate: (n, t) =>
      rec
        .begin({ zh: 'N' + n + ' 候选 term' + t, en: 'candidate' })
        .setAux([{ label: 'term', value: String(t), role: 'pivot' as BarRole }])
        .commit(),
    onVote: (v) =>
      rec
        .begin({ zh: 'N' + v + ' 投票', en: 'vote' })
        .setAux([{ label: 'vote', value: 'N' + v, role: 'compare' as BarRole }])
        .commit(),
    onLeader: (n) =>
      rec
        .begin({ zh: 'N' + n + ' 当选', en: 'leader' })
        .setAux([{ label: 'leader', value: 'N' + n, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'leader=' + r.leader, en: 'leader' })
    .setAux([{ label: 'leader', value: String(r.leader), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
