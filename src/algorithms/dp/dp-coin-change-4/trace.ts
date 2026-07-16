// =============================================================================
// 零钱兑换（贪心对照）· 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinChangeCompare, type CoinChangeHooks } from './impl.ts';

export const DEFAULT_INPUT = { coins: [1, 3, 4], amount: 6 };

export function buildTrace(input: { coins: number[]; amount: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { coins, amount } = input;
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  let curA = -1;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(
        dp.map((v) => (Number.isFinite(v) ? v : -1)),
        dp.map((_, a) => (a === curA ? 'compare' : 'default')),
        [{ index: curA < 0 ? 0 : curA, label: 'a' }],
      )
      .setAux([{ label: '面值', value: coins.join(','), role: 'frontier' }])
      .commit();
  };

  snap({
    zh: `面值=[${coins.join(',')}] amount=${amount}`,
    en: `coins=[${coins.join(',')}] amount=${amount}`,
  });

  const hooks: CoinChangeHooks = {
    onCell: (a, val) => {
      dp[a] = val;
      curA = a;
      snap({
        zh: `dp[${a}]=${Number.isFinite(val) ? val : '∞'}`,
        en: `dp[${a}]=${Number.isFinite(val) ? val : 'inf'}`,
      });
    },
  };

  const r = coinChangeCompare(coins, amount, hooks);

  rec
    .begin({
      zh: `DP=${r.dp}, 贪心=${r.greedy} ${r.greedyOptimal ? '（贪心最优）' : '（贪心次优）'}`,
      en: `DP=${r.dp}, Greedy=${r.greedy} ${r.greedyOptimal ? '(optimal)' : '(suboptimal)'}`,
    })
    .setAux([
      { label: 'DP 最优', value: String(r.dp), role: 'final' },
      { label: '贪心结果', value: String(r.greedy), role: r.greedyOptimal ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
