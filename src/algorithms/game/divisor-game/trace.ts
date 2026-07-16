// =============================================================================
// 除数博弈 · 录制帧序列
// 可视化：setBars 渲染 dp 序列（0/1）；setAux 展示当前状态与结论。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { divisorGame, type DivisorGameHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const dpVis: number[] = [0]; // dpVis[1..n]，0 必败 1 必胜

  rec
    .begin({
      zh: `除数博弈：N=${n}，Alice 先手，选真因数 x 使 N-=x，把 N 变 1 者胜`,
      en: `Divisor Game: N=${n}, Alice first, pick proper divisor x, N-=x, reach 1 to win`,
    })
    .setBars([{ value: 0, role: 'default' }])
    .setAux([
      { label: 'N', value: String(n), role: 'default' },
      { label: '规则', value: 'dp[i]=存在因数 x 使 dp[i-x]=false', role: 'pivot' },
    ])
    .commit();

  const hooks: DivisorGameHooks = {
    onState: (i, wins, winningMove) => {
      dpVis[i] = wins ? 1 : 0;
      const bars = dpVis.map((v) => ({ value: v, role: (v === 1 ? 'final' : 'warn') as BarRole }));
      const pointers = [{ index: i, label: `N=${i}` }];
      rec
        .begin({
          zh: `N=${i}：${wins ? `当前玩家必胜（选 x=${winningMove}）` : '当前玩家必败'}`,
          en: `N=${i}: ${wins ? `current player wins (x=${winningMove})` : 'current player loses'}`,
        })
        .setArray(
          bars.map((b) => b.value),
          bars.map((b) => b.role),
          pointers,
        )
        .setAux([
          { label: '当前 N', value: String(i), role: 'pivot' },
          {
            label: '判定',
            value: wins ? '必胜' : '必败',
            role: wins ? 'final' : ('warn' as BarRole),
          },
        ])
        .commit();
    },
    onConclude: () => {
      void 0;
    },
  };

  const result = divisorGame(n, hooks);

  rec
    .begin({
      zh: result.aliceWins
        ? `Alice 必胜（N=${n} 为偶数，第一步选 x=${result.firstMove}）`
        : `Alice 必败（N=${n} 为奇数）`,
      en: result.aliceWins
        ? `Alice wins (N=${n} even, first move x=${result.firstMove})`
        : `Alice loses (N=${n} odd)`,
    })
    .setArray(
      result.dp.map((v) => (v ? 1 : 0)),
      result.dp.map((v) => (v ? 'final' : ('warn' as BarRole))),
      [],
    )
    .setAux([
      {
        label: 'Alice 必胜？',
        value: result.aliceWins ? '是' : '否',
        role: result.aliceWins ? 'final' : ('warn' as BarRole),
      },
      ...(result.firstMove > 0
        ? [{ label: '第一步', value: `x=${result.firstMove}`, role: 'final' as BarRole }]
        : []),
    ])
    .commit();

  return rec.build();
}
