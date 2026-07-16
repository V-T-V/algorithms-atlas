import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { banditUcb } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const R = [
    [1, 0, 1, 1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 0, 0],
  ];
  rec
    .begin({ zh: 'UCB1 两臂老虎机', en: 'UCB1 two-armed bandit' })
    .setBars(R.map((_, a) => ({ value: 0, role: 'default' as BarRole, label: 'arm' + a })))
    .commit();
  banditUcb(R, {
    onSelect: (t, arm, ucb) =>
      rec
        .begin({ zh: `t=${t} 选臂 ${arm}`, en: `t=${t} pick arm ${arm}` })
        .setBars(
          ucb.map((u, a) => ({
            value: u,
            role: a === arm ? ('final' as BarRole) : ('default' as BarRole),
            label: 'UCB' + a,
          })),
        )
        .commit(),
  });
  return rec.build();
}
