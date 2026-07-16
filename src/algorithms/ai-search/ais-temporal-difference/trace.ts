// TD(λ) · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tdLambda, type Episode } from './impl.ts';

export const DEFAULT_INPUT = { gamma: 0.9, lambda: 0.5, alpha: 0.2, episodes: 100 };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { gamma, lambda, alpha, episodes } = input;

  // 单一回合 0->1(r=1)->2(r=0,终止)
  const data: Episode[] = [{ states: [0, 1, 2], rewards: [1, 0] }];
  const _labels = ['s0', 's1', 's2'];

  rec
    .begin({ zh: `TD(λ=${lambda})：V=0`, en: `TD(λ=${lambda}): V=0` })
    .setBars([0, 0, 0].map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  tdLambda(3, data, {
    gamma,
    lambda,
    alpha,
    episodes,
    hooks: {
      onEpisode: (ep, V, mse) => {
        if (ep % 10 === 0 || ep === episodes - 1) {
          rec
            .begin({
              zh: `第 ${ep + 1} 回合，MSE=${mse.toExponential(1)}`,
              en: `Episode ${ep + 1}, MSE=${mse.toExponential(1)}`,
            })
            .setBars(
              [0, 1, 2].map((i) => ({
                value: Number(V[i]!.toFixed(3)),
                role: 'compare' as BarRole,
              })),
            )
            .commit();
        }
      },
    },
  });

  // 解析值：V(s1)=0 (其转移 r=0 到终态)，V(s0)=1 (其转移 r=1 到 s1)
  rec
    .begin({ zh: '收敛：TD(λ) 价值', en: 'Converged: TD(λ) values' })
    .setBars(
      [0, 1, 2].map((i) => ({
        value: Number((i === 0 ? 1 : 0).toFixed(3)),
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
