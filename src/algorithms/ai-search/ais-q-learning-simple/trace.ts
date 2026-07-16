// Q-Learning · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { qLearn, qToPolicy, type QDomain } from './impl.ts';

function makeDomain(): QDomain {
  return {
    states: [0, 1],
    actions: [0, 1],
    start: () => 0,
    step: (s, a) => {
      if (s === 0) return a === 1 ? ([1, 0, false] as const) : ([0, 0, false] as const);
      return [1, 1, false] as const;
    },
  };
}

export const DEFAULT_INPUT = { gamma: 0.9, alpha: 0.3, epsilon: 0.3, episodes: 200 };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { gamma, alpha, epsilon, episodes } = input;
  const domain = makeDomain();
  const _labels = ['(s0,a0)', '(s0,a1)', '(s1,a0)', '(s1,a1)'];

  rec
    .begin({ zh: 'Q-Learning：Q=0', en: 'Q-Learning: Q=0' })
    .setBars([0, 0, 0, 0].map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const rng = (() => {
    let s = 7 >>> 0;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 0x100000000;
    };
  })();

  let snap = 0;
  const Q = qLearn(domain, {
    gamma,
    alpha,
    epsilon,
    episodes,
    maxSteps: 5,
    rng,
    hooks: {
      onEpisode: (ep, _ret, Qcur) => {
        snap++;
        if (snap % 40 === 0 || ep === episodes - 1) {
          rec
            .begin({ zh: `第 ${ep + 1} 回合 Q 值快照`, en: `Episode ${ep + 1} Q snapshot` })
            .setBars(
              [Qcur[0]![0]!, Qcur[0]![1]!, Qcur[1]![0]!, Qcur[1]![1]!].map((v) => ({
                value: Number(v.toFixed(2)),
                role: 'compare' as BarRole,
              })),
            )
            .commit();
        }
      },
    },
  });

  rec
    .begin({ zh: '收敛 Q 表', en: 'Converged Q-table' })
    .setBars(
      [Q[0]![0]!, Q[0]![1]!, Q[1]![0]!, Q[1]![1]!].map((v) => ({
        value: Number(v.toFixed(2)),
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      {
        label: 'π',
        value: `[${qToPolicy(Q, domain.states, domain.actions)}]`,
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
