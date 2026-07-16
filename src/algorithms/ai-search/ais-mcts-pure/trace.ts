import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pureMcts, makeLcg, type MctsDomain } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  // K-臂问题：动作 0 最优
  const arms = 3;
  const truth = [0.8, 0.4, 0.6];
  const domain: MctsDomain<number> = {
    legalActions: () => Array.from({ length: arms }, (_, i) => i),
    apply: (s, a) => s + a,
    isTerminal: (s) => s >= 1,
    reward: (s) => {
      const lastAction = s; // 简化
      const mu = truth[lastAction] ?? 0.5;
      return Math.random() < mu ? 1 : 0;
    },
  };

  rec
    .begin({ zh: `初始化 ${arms} 臂 MCTS`, en: `Init ${arms}-arm MCTS` })
    .setBars(
      truth.map((t) => ({ value: t, role: 'default' as BarRole, label: `a${t.toFixed(1)}` })),
    )
    .setAux([{ label: '迭代', value: '50', role: 'compare' as BarRole }])
    .commit();

  const { root, bestAction } = pureMcts(0, domain, 50, makeLcg(1), Math.SQRT2, {
    onResult: (ba, visits) => {
      rec
        .begin({ zh: `推荐动作 ${ba} 访问${visits}`, en: `best action ${ba} visits${visits}` })
        .setBars(
          root.children.map((ch) => ({
            value: ch.wins / Math.max(1, ch.visits),
            role: (ch.action === ba ? 'final' : 'default') as BarRole,
            label: `a${ch.action}:${ch.visits}`,
          })),
        )
        .setAux([{ label: '最佳', value: String(ba), role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：推荐 a${bestAction}`, en: `Done: best a${bestAction}` })
    .setBars(
      root.children.map((ch) => ({
        value: ch.visits,
        role: (ch.action === bestAction ? 'sorted' : 'default') as BarRole,
        label: `a${ch.action}`,
      })),
    )
    .setAux([{ label: '最佳动作', value: String(bestAction), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
