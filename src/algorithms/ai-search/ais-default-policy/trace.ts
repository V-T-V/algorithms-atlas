import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomRollout, makeLcg, type RolloutDomain } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化随机 rollout`, en: `Init random rollout` })
    .setAux([{ label: '方法', value: '纯随机走子', role: 'compare' as BarRole }])
    .commit();

  // 简单计数领域：状态 = 当前数字，动作 +1/+2/+3，到达 10 终局
  const domain: RolloutDomain<number> = {
    legalActions: (_s) => [0, 1, 2], // 3 种动作
    apply: (s, a) => s + a + 1,
    isTerminal: (s) => s >= 10,
    reward: (s) => (s >= 10 ? 1 : 0),
  };
  const rng = makeLcg(42);

  randomRollout(0, domain, rng, 100, {
    onStep: (action, depth) => {
      rec
        .begin({ zh: `depth${depth} 动作${action}`, en: `depth${depth} action${action}` })
        .setBars(
          [0, 1, 2].map((a) => ({
            value: a + 1,
            role: (a === action ? 'pivot' : 'default') as BarRole,
            label: `+${a + 1}`,
          })),
        )
        .setAux([{ label: 'depth', value: String(depth), role: 'compare' as BarRole }])
        .commit();
    },
    onResult: (reward, depth) => {
      rec
        .begin({
          zh: `终局 reward=${reward} depth=${depth}`,
          en: `terminal reward=${reward} depth=${depth}`,
        })
        .setAux([
          { label: 'reward', value: String(reward), role: 'final' as BarRole },
          { label: 'depth', value: String(depth), role: 'compare' as BarRole },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([{ label: '说明', value: 'rollout 演示', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
