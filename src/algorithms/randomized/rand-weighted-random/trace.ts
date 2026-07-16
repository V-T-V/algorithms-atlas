import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WeightedRandom, makeRng } from './impl.ts';

export const DEFAULT_WEIGHTS = [1, 3, 2, 4];
export const DEFAULT_SAMPLES = 20;

export function buildTrace(
  opts: { weights?: number[]; samples?: number; seed?: number } = {},
): Frame[] {
  const weights = opts.weights ?? DEFAULT_WEIGHTS;
  const samples = opts.samples ?? DEFAULT_SAMPLES;
  const seed = opts.seed ?? 42;
  const rec = new TraceRecorder();
  const wr = new WeightedRandom(weights);
  const rng = makeRng(seed);
  const counts = new Array(weights.length).fill(0);

  const snap = (note: { zh: string; en: string }, last: number): void => {
    rec
      .begin(note)
      .setBars(
        counts.map((c, i) => ({
          value: c,
          role: (i === last ? 'final' : 'default') as BarRole,
          label: `w=${weights[i]}:${c}`,
        })),
      )
      .setAux([
        { label: '权重', value: weights.join(','), role: 'compare' as BarRole },
        { label: '累计', value: wr.cumsum.join(','), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始化权重 [${weights.join(',')}]`, en: `Init weights [${weights.join(',')}]` }, -1);

  let last = -1;
  for (let i = 0; i < samples; i++) {
    last = wr.pick(rng);
    counts[last]!++;
    snap({ zh: `抽取 ${last}`, en: `Pick ${last}` }, last);
  }

  rec
    .begin({ zh: `完成：各计数 [${counts.join(',')}]`, en: `Done: counts [${counts.join(',')}]` })
    .setBars(counts.map((c) => ({ value: c, role: 'final' as BarRole, label: String(c) })))
    .setAux([{ label: '计数', value: counts.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
