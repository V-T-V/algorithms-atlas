import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { strategicVoting } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const voters = [
    { prefs: [0, 1, 2] },
    { prefs: [0, 1, 2] },
    { prefs: [1, 0, 2] },
    { prefs: [2, 1, 0] },
    { prefs: [2, 1, 0] },
  ];
  rec
    .begin({ zh: '策略投票：3 候选人', en: 'Strategic voting: 3 candidates' })
    .setBars([0, 0, 0].map((_, i) => ({ value: 0, role: 'default' as BarRole, label: 'c' + i })))
    .commit();
  const preview = strategicVoting(voters, 3);
  const r = strategicVoting(voters, 3, {
    onTally: (c) =>
      rec
        .begin({ zh: `真诚计票 [${c.join(',')}]`, en: `Sincere tally [${c.join(',')}]` })
        .setBars(
          c.map((v, i) => ({
            value: v,
            role: i === preview.sincere ? ('final' as BarRole) : ('default' as BarRole),
          })),
        )
        .commit(),
  });
  rec
    .begin({
      zh: `真诚赢家=${r.sincere} 策略赢家=${r.strategic}`,
      en: `sincere=${r.sincere} strategic=${r.strategic}`,
    })
    .setAux([
      { label: '真诚', value: String(r.sincere), role: 'compare' as BarRole },
      { label: '策略', value: String(r.strategic), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
