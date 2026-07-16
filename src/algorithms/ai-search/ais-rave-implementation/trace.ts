import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RaveStats, raveBeta } from './impl.ts';

export const DEFAULT_ACTIONS = [0, 1, 2];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 RAVE 3 动作`, en: `Init RAVE 3 actions` })
    .setBars(
      DEFAULT_ACTIONS.map((a) => ({ value: 0.5, role: 'default' as BarRole, label: `a${a}` })),
    )
    .setAux([{ label: '说明', value: 'β·RAVE+(1-β)·MC', role: 'compare' as BarRole }])
    .commit();

  const stats = new RaveStats(1);
  // 模拟：动作 0 多次获胜
  const rollouts: Array<{ main: number; reward: number; all: number[] }> = [
    { main: 0, reward: 1, all: [0, 1, 2] },
    { main: 0, reward: 1, all: [0, 2] },
    { main: 1, reward: 0, all: [1, 2] },
    { main: 0, reward: 1, all: [0, 1] },
    { main: 1, reward: 1, all: [1, 0, 2] },
  ];
  for (let i = 0; i < rollouts.length; i++) {
    const r = rollouts[i]!;
    stats.recordRollout(r.main, r.reward, r.all, {
      onEstimate: (action, mcValue, raveValue, beta, blended) => {
        rec
          .begin({
            zh: `模拟${i + 1}: a${action} MC=${mcValue.toFixed(2)} RAVE=${raveValue.toFixed(2)} β=${beta.toFixed(2)} 混合=${blended.toFixed(2)}`,
            en: `roll${i + 1}: a${action} MC=${mcValue.toFixed(2)} RAVE=${raveValue.toFixed(2)} β=${beta.toFixed(2)} blend=${blended.toFixed(2)}`,
          })
          .setBars(
            DEFAULT_ACTIONS.map((a) => {
              const est = stats.estimates().find((e) => e.action === a);
              return {
                value: est ? est.value : 0.5,
                role: (a === action ? 'final' : 'default') as BarRole,
                label: `a${a}`,
              };
            }),
          )
          .setAux([
            { label: 'MC', value: mcValue.toFixed(2), role: 'compare' as BarRole },
            { label: 'RAVE', value: raveValue.toFixed(2), role: 'compare' as BarRole },
          ])
          .commit();
      },
    });
  }

  const ests = stats.estimates();
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(
      ests.map((e) => ({ value: e.value, role: 'sorted' as BarRole, label: `a${e.action}` })),
    )
    .setAux(
      ests.map((e) => ({
        label: `a${e.action}`,
        value: e.value.toFixed(3),
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}

void raveBeta;
