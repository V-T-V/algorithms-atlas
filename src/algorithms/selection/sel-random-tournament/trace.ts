import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomTournament, makeRng } from './impl.ts';

export const DEFAULT_INPUT = [3, 7, 2, 9, 5, 1, 8, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT, seed = 1): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始 ${input.length} 选手`, en: `Init ${input.length} players` })
    .setBars(input.map((v, i) => ({ value: v, role: 'default' as BarRole, label: `P${i}:${v}` })))
    .setAux([{ label: '选手', value: input.join(','), role: 'compare' as BarRole }])
    .commit();

  const r = randomTournament(input, makeRng(seed));

  for (const round of r.rounds) {
    rec
      .begin({
        zh: `第 ${round.round} 轮，存活 ${round.survivors.length}`,
        en: `Round ${round.round}, ${round.survivors.length} survivors`,
      })
      .setBars(
        round.survivors.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })),
      )
      .setAux(
        round.pairs.map((p) => ({
          label: `${p.a} vs ${p.b}`,
          value: String(p.winner),
          role: 'compare' as BarRole,
        })),
      )
      .commit();
  }

  rec
    .begin({ zh: `完成：冠军 ${r.champion}`, en: `Done: champion ${r.champion}` })
    .setBars([{ value: r.champion, role: 'final' as BarRole, label: String(r.champion) }])
    .setAux([{ label: '冠军', value: String(r.champion), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
