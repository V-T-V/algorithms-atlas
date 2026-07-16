import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { metropolisHastings, makeRng } from './impl.ts';

export const DEFAULT_STEPS = 40;
export const DEFAULT_MU = 0;
export const DEFAULT_SIGMA = 1;

export function buildTrace(
  opts: { steps?: number; mu?: number; sigma?: number; seed?: number } = {},
): Frame[] {
  const steps = opts.steps ?? DEFAULT_STEPS;
  const mu = opts.mu ?? DEFAULT_MU;
  const sigma = opts.sigma ?? DEFAULT_SIGMA;
  const seed = opts.seed ?? 1;
  const rec = new TraceRecorder();
  const bins = new Array(11).fill(0); // [-5,5] 分 11 桶
  const samples: number[] = [];

  const snap = (note: { zh: string; en: string }, cur: number): void => {
    const idx = Math.max(0, Math.min(10, Math.floor(((cur + 5) / 10) * 11)));
    bins[idx]!++;
    samples.push(cur);
    rec
      .begin(note)
      .setBars(
        bins.map((b, i) => ({
          value: b,
          role: (i === 5 ? 'pivot' : 'default') as BarRole,
          label: `b${i}:${b}`,
        })),
      )
      .setAux([
        { label: '当前样本', value: cur.toFixed(3), role: 'final' as BarRole },
        { label: '目标', value: `N(${mu},${sigma}^2)`, role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始化 MCMC`, en: `Init MCMC` }, mu);

  const result = metropolisHastings(
    steps,
    mu,
    (x) => Math.exp(-(((x - mu) / sigma) ** 2) / 2),
    makeRng(seed),
    sigma,
    {
      onAccept: (next) =>
        snap({ zh: `接受 ${next.toFixed(2)}`, en: `Accept ${next.toFixed(2)}` }, next),
      onReject: (cur) =>
        snap({ zh: `拒绝，停留 ${cur.toFixed(2)}`, en: `Reject, stay ${cur.toFixed(2)}` }, cur),
    },
  );

  void result;
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  rec
    .begin({
      zh: `完成：样本均值 ${mean.toFixed(3)} ≈ ${mu}`,
      en: `Done: mean ${mean.toFixed(3)} ≈ ${mu}`,
    })
    .setAux([{ label: '均值', value: mean.toFixed(4), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
