import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinChange, type CoinHooks } from './impl.ts';

export const DEFAULT_COINS = [1, 5, 11];
export const DEFAULT_AMOUNT = 15;

export function buildTrace(
  coins: readonly number[] = DEFAULT_COINS,
  amount: number = DEFAULT_AMOUNT,
): Frame[] {
  const rec = new TraceRecorder();
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  rec
    .begin({
      zh: `金额 ${amount}，面额 ${coins.join(',')}`,
      en: `Amount ${amount}, coins ${coins.join(',')}`,
    })
    .setBars(
      dp.map((v) => ({
        value: v === INF ? 0 : v,
        role: 'default' as BarRole,
        label: String(v === INF ? '∞' : v),
      })),
    )
    .commit();
  const hooks: CoinHooks = {
    onRelax: (amt, coin, val) => {
      dp[amt] = val;
      rec
        .begin({
          zh: `dp[${amt}]=${val}（用硬币 ${coin}）`,
          en: `dp[${amt}]=${val} (coin ${coin})`,
        })
        .setBars(
          dp.map((v, j) => ({
            value: v === INF ? 0 : v,
            role: (j === amt ? 'swap' : 'default') as BarRole,
            label: String(v === INF ? '∞' : v),
          })),
        )
        .commit();
    },
  };
  const ans = coinChange(coins, amount, hooks);
  rec
    .begin({ zh: `最少硬币=${ans}`, en: `Min coins=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
