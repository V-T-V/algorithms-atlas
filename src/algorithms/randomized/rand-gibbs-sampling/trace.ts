import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gibbsSample2d, makeRng } from './impl.ts';

export const DEFAULT_STEPS = 40;

export function buildTrace(opts: { steps?: number; rho?: number; seed?: number } = {}): Frame[] {
  const steps = opts.steps ?? DEFAULT_STEPS;
  const rho = opts.rho ?? 0.6;
  const seed = opts.seed ?? 1;
  const rec = new TraceRecorder();
  const xs: Array<[number, number]> = [];

  const snap = (note: { zh: string; en: string }, cur: [number, number]): void => {
    xs.push([...cur] as [number, number]);
    rec
      .begin(note)
      .setBars([
        {
          value: Math.round((cur[0]! + 3) * 10),
          role: 'final' as BarRole,
          label: `x0:${cur[0]!.toFixed(2)}`,
        },
        {
          value: Math.round((cur[1]! + 3) * 10),
          role: 'pivot' as BarRole,
          label: `x1:${cur[1]!.toFixed(2)}`,
        },
      ])
      .setAux([
        {
          label: '当前',
          value: `(${cur[0]!.toFixed(2)}, ${cur[1]!.toFixed(2)})`,
          role: 'final' as BarRole,
        },
        { label: 'rho', value: rho.toString(), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: '初始化 Gibbs 采样', en: 'Init Gibbs sampling' }, [0, 0]);

  gibbsSample2d(steps, 0, 0, rho, [0, 0], makeRng(seed), {
    onUpdate: (_dim, _v, state) => {
      snap(
        {
          zh: `更新 → (${state[0]!.toFixed(2)},${state[1]!.toFixed(2)})`,
          en: `Update → (${state[0]!.toFixed(2)},${state[1]!.toFixed(2)})`,
        },
        [state[0]!, state[1]!],
      );
    },
  });

  const mean0 = xs.reduce((a, b) => a + b[0]!, 0) / xs.length;
  const mean1 = xs.reduce((a, b) => a + b[1]!, 0) / xs.length;
  rec
    .begin({
      zh: `完成：均值 (${mean0.toFixed(2)}, ${mean1.toFixed(2)})`,
      en: `Done: mean (${mean0.toFixed(2)}, ${mean1.toFixed(2)})`,
    })
    .setAux([
      {
        label: '均值',
        value: `(${mean0.toFixed(3)}, ${mean1.toFixed(3)})`,
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
