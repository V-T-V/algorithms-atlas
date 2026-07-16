// =============================================================================
// 最佳观光组合 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxScoreSightseeingPair, type BestSightseeingHooks } from './impl.ts';

export const DEFAULT_INPUT = [8, 1, 5, 2, 6];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const _n = input.length;
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }, maxAi: number): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i === cur ? 'compare' : i < cur ? 'frontier' : 'default',
    );
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r]))))
      .setAux([
        { label: 'maxAi (values[i]+i)', value: String(maxAi), role: 'pivot' },
        { label: '当前最佳', value: String(ans), role: 'frontier' },
      ])
      .commit();
  };

  snap({ zh: `values=[${input.join(', ')}]`, en: `values=[${input.join(', ')}]` }, input[0]! + 0);

  const hooks: BestSightseeingHooks = {
    onDay: (j, maxAi, _curScore, best) => {
      cur = j;
      ans = best;
      snap(
        {
          zh: `j=${j}: maxAi=${maxAi}, score=${maxAi + input[j]! - j}`,
          en: `j=${j}: maxAi=${maxAi}`,
        },
        maxAi,
      );
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最大得分 = ${t}`, en: `Max score = ${t}` }, 0);
    },
  };

  maxScoreSightseeingPair(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '得分 / score', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
