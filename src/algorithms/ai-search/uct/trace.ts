// =============================================================================
// UCT 选择策略 · 录制帧序列
// 用 setBars 展示各子节点的 UCB 值（最高者高亮），setAux 显示 visits/wins/选择次数。
// 演示多臂赌博机：4 个臂真实期望 [0.9, 0.5, 0.3, 0.1]，UCT 应收敛到臂 0。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { UCT, uctBandit, makeLcg, type UctNode } from './impl.ts';

export const DEFAULT_REWARDS: number[] = [0.9, 0.5, 0.3, 0.1];
export const DEFAULT_ITERATIONS: number = 40;
export const DEFAULT_SEED: number = 42;

export function buildTrace(
  rewards: number[] = DEFAULT_REWARDS,
  iterations: number = DEFAULT_ITERATIONS,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();

  const uct = new UCT(Math.SQRT2);

  rec
    .begin({
      zh: `${rewards.length} 臂赌博机，真实期望 [${rewards.join(',')}]，${iterations} 次迭代`,
      en: `${rewards.length}-armed bandit, true means [${rewards.join(',')}], ${iterations} iters`,
    })
    .setBars(
      rewards.map((_, i) => ({
        value: 0,
        role: (i === 0 ? 'final' : 'default') as BarRole,
        label: `臂${i}`,
      })),
    )
    .setAux([
      { label: '迭代', value: `0/${iterations}`, role: 'pivot' },
      ...rewards.map((_, i) => ({
        label: `臂${i}`,
        value: 'v=0 w=0',
        role: 'default' as BarRole,
      })),
    ])
    .commit();

  // 手动跑迭代以便逐步渲染
  const parent: UctNode = { visits: 0, wins: 0 };
  const children: UctNode[] = rewards.map(() => ({ visits: 0, wins: 0 }));
  const selections = new Array<number>(rewards.length).fill(0);
  const rng = makeLcg(seed);
  const FRAME_EVERY = Math.max(1, Math.floor(iterations / 10));

  const renderFrame = (iter: number): void => {
    const ucbs = uct.ucbValues(parent, children);
    const bestIdx = ucbs.reduce((bi, u, i) => (u > (ucbs[bi] ?? -Infinity) ? i : bi), 0);
    const bars = ucbs.map((u, i) => ({
      value: u === Infinity ? 100 : Math.round(u * 100),
      role: (i === bestIdx ? 'compare' : 'default') as BarRole,
      label: `臂${i}`,
    }));
    const aux = [
      { label: '迭代', value: `${iter}/${iterations}`, role: 'pivot' as BarRole },
      { label: '父访问', value: String(parent.visits), role: 'frontier' as BarRole },
      ...children.map((c, i) => ({
        label: `臂${i}`,
        value: `v=${c.visits} w=${c.wins} sel=${selections[i]}`,
        role: i === bestIdx ? ('compare' as BarRole) : ('default' as BarRole),
      })),
    ];
    rec
      .begin({
        zh: `迭代 ${iter}：UCB 最高 = 臂 ${bestIdx}（${ucbs[bestIdx] === Infinity ? '∞' : ucbs[bestIdx]!.toFixed(2)}）`,
        en: `Iter ${iter}: highest UCB = arm ${bestIdx} (${ucbs[bestIdx] === Infinity ? 'inf' : ucbs[bestIdx]!.toFixed(2)})`,
      })
      .setBars(bars)
      .setAux(aux)
      .commit();
  };

  for (let t = 1; t <= iterations; t++) {
    const idx = uct.selectBest(parent, children);
    const reward = rng() < (rewards[idx] ?? 0.5) ? 1 : 0;
    parent.visits++;
    parent.wins += reward;
    children[idx]!.visits++;
    children[idx]!.wins += reward;
    selections[idx]!++;
    if (t % FRAME_EVERY === 0 || t === iterations) {
      renderFrame(t);
    }
  }

  // 终态：用 uctBandit 跑一遍拿到对照（确认一致性），并显示最终选择分布
  const final = uctBandit(rewards, iterations, Math.SQRT2, makeLcg(seed));
  const bestArm = final.selections.indexOf(Math.max(...final.selections));

  rec
    .begin({
      zh: `完成：臂 ${bestArm} 被选最多（${final.selections[bestArm]} 次），应 = 真实最优臂 0`,
      en: `Done: arm ${bestArm} selected most (${final.selections[bestArm]} times), should equal best arm 0`,
    })
    .setBars(
      final.selections.map((s, i) => ({
        value: s,
        role: (i === bestArm ? 'final' : 'sorted') as BarRole,
        label: `臂${i}`,
      })),
    )
    .setAux([
      { label: '总迭代', value: String(iterations), role: 'final' },
      ...final.selections.map((s, i) => ({
        label: `臂${i} 选中`,
        value: String(s),
        role: i === bestArm ? ('final' as BarRole) : ('default' as BarRole),
      })),
    ])
    .commit();

  return rec.build();
}
