import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { memory1ValueIteration, titForTatPolicy, prisonerReward } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  const policy = titForTatPolicy();
  const reward = prisonerReward();
  const states = ['CC', 'CD', 'DC', 'DD'];

  rec
    .begin({ zh: `初始化 Memory-1 (TFT 对 PD)`, en: `Init Memory-1 (TFT vs PD)` })
    .setBars(states.map((s) => ({ value: 0, role: 'default' as BarRole, label: s })))
    .setAux([{ label: '策略', value: 'Tit-for-Tat', role: 'compare' as BarRole }])
    .commit();

  const { values, iterations } = memory1ValueIteration(4, policy, reward, 0.9, 1e-4, {
    onIterate: (iter, delta) => {
      rec
        .begin({
          zh: `迭代${iter} delta=${delta.toFixed(4)}`,
          en: `iter${iter} delta=${delta.toFixed(4)}`,
        })
        .setBars(
          values.map((v, i) => ({ value: v, role: 'default' as BarRole, label: states[i]! })),
        )
        .setAux([{ label: 'delta', value: delta.toFixed(4), role: 'compare' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：${iterations} 次迭代`, en: `Done: ${iterations} iterations` })
    .setBars(values.map((v, i) => ({ value: v, role: 'final' as BarRole, label: states[i]! })))
    .setAux(
      values.map((v, i) => ({ label: states[i]!, value: v.toFixed(2), role: 'final' as BarRole })),
    )
    .commit();
  return rec.build();
}
