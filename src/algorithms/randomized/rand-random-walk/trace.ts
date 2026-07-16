import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomWalk, makeRng, everReturnedToOrigin } from './impl.ts';

export const DEFAULT_STEPS = 30;

export function buildTrace(opts: { steps?: number; seed?: number } = {}): Frame[] {
  const steps = opts.steps ?? DEFAULT_STEPS;
  const seed = opts.seed ?? 1;
  const rec = new TraceRecorder();
  let positions: number[] = [];
  let shown = 0;

  const snap = (note: { zh: string; en: string }): void => {
    // 把到 shown 为止的位置序列作为柱状图
    const slice = positions.slice(0, shown + 1);
    const bars = slice.map((p, t) => ({
      value: p,
      role: (t === slice.length - 1 ? 'final' : t === 0 ? 'pivot' : 'default') as BarRole,
      label: `${t}:${p}`,
    }));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '当前步', value: shown.toString(), role: 'compare' as BarRole },
        { label: '当前位置', value: (positions[shown] ?? 0).toString(), role: 'final' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始化随机游走 steps=${steps}`, en: `Init walk steps=${steps}` });
  positions = [0];
  shown = 0;

  positions = randomWalk(steps, makeRng(seed), 0.5, {
    onStep: (t, pos) => {
      if (positions.length <= t) positions[t] = pos;
      shown = t;
      if (t % 2 === 0 || t === steps) snap({ zh: `t=${t} pos=${pos}`, en: `t=${t} pos=${pos}` });
    },
  });
  shown = positions.length - 1;

  const final = positions[positions.length - 1]!;
  rec
    .begin({
      zh: `完成：终点 ${final}，回归原点？${everReturnedToOrigin(positions)}`,
      en: `Done: end=${final}, returned=${everReturnedToOrigin(positions)}`,
    })
    .setBars([
      { value: Math.abs(final), role: 'final' as BarRole, label: `|end|=${Math.abs(final)}` },
    ])
    .setAux([
      { label: '终点', value: final.toString(), role: 'final' as BarRole },
      {
        label: '回归原点',
        value: everReturnedToOrigin(positions) ? '是' : '否',
        role: 'compare' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
