import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mctsSolver, type SolverDomain } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  // 简单游戏：状态 = 步数，到 3 终局，行动者赢
  const domain: SolverDomain<number> = {
    legalActions: (s) => (s < 3 ? [0] : []), // 只一条路
    apply: (s) => s + 1,
    terminalValue: (s) => (s >= 3 ? 1 : null), // 到达者赢
  };

  rec
    .begin({ zh: `初始化求解器`, en: `Init solver` })
    .setAux([{ label: '说明', value: '证明值标记', role: 'compare' as BarRole }])
    .commit();

  const { proof, root } = mctsSolver(0, domain, 50, {
    onProven: (action, p) => {
      rec
        .begin({ zh: `动作 ${action} 证明为 ${p}`, en: `action ${action} proven ${p}` })
        .setBars([
          {
            value: 1,
            role: (p === 'win' ? 'final' : p === 'loss' ? 'warn' : 'default') as BarRole,
            label: `${p}`,
          },
        ])
        .setAux([{ label: '证明', value: p, role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：根证明=${proof}`, en: `Done: root proof=${proof}` })
    .setBars([
      {
        value: root.visits,
        role: (proof === 'win' ? 'sorted' : 'default') as BarRole,
        label: `root:${proof}`,
      },
    ])
    .setAux([{ label: '结果', value: proof, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
