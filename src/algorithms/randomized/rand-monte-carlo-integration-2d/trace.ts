import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { monteCarloIntegrate2d, makeRng } from './impl.ts';

export const DEFAULT_N = 200;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 1;
  const rec = new TraceRecorder();
  let hits = 0;
  let thrown = 0;
  // 单位圆第一象限面积 = π/4，矩形 [-1,1]^2 面积 4
  const f = (x: number, y: number): boolean => x * x + y * y <= 1;

  const snap = (note: { zh: string; en: string }): void => {
    const est = thrown > 0 ? (hits / thrown) * 4 : 0;
    rec
      .begin(note)
      .setBars([
        { value: hits, role: 'final' as BarRole, label: `命中:${hits}` },
        { value: thrown - hits, role: 'default' as BarRole, label: `未中:${thrown - hits}` },
      ])
      .setAux([
        { label: '投点', value: thrown.toString(), role: 'compare' as BarRole },
        { label: 'π 估计', value: est.toFixed(4), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始化 N=${n}`, en: `Init N=${n}` });

  const est = monteCarloIntegrate2d(f, { x0: -1, x1: 1, y0: -1, y1: 1 }, n, makeRng(seed), {
    onSample: (_x, _y, hit) => {
      thrown++;
      if (hit) hits++;
      if (thrown % 20 === 0 || thrown === n) {
        snap({ zh: `投点 ${thrown}`, en: `Throw ${thrown}` });
      }
    },
  });

  rec
    .begin({
      zh: `完成：面积估计 ${est.toFixed(4)} (π≈${est.toFixed(4)})`,
      en: `Done: area ≈ ${est.toFixed(4)} (π≈${est.toFixed(4)})`,
    })
    .setAux([
      { label: '面积估计', value: est.toFixed(4), role: 'final' as BarRole },
      { label: '真值', value: Math.PI.toFixed(4), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
