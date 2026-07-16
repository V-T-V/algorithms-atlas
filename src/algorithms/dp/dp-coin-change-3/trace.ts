// =============================================================================
// 零钱兑换（字典序最小）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinChangeLex, type CoinChangeLexHooks } from './impl.ts';

export const DEFAULT_COINS = [1, 2, 5];
export const DEFAULT_AMOUNT = 11;

export function buildTrace(
  coins: readonly number[] = DEFAULT_COINS,
  amount: number = DEFAULT_AMOUNT,
): Frame[] {
  const rec = new TraceRecorder();
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  let lastAmt = -1;
  let ans = { count: -1, coins: [] as number[] };

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = dp.map((_, j) =>
      j === lastAmt
        ? 'compare'
        : j === amount
          ? 'pivot'
          : Number.isFinite(dp[j]!)
            ? 'frontier'
            : 'default',
    );
    rec
      .begin(note)
      .setArray(
        dp.map((v) => (Number.isFinite(v) ? v : -1)),
        roles,
        [{ index: lastAmt < 0 ? 0 : lastAmt, label: 'i' }],
      )
      .setAux([
        {
          label: 'dp',
          value: dp.map((v) => (Number.isFinite(v) ? `${v}` : '∞')).join(' '),
          role: 'frontier',
        },
        { label: '答案方案', value: ans.coins.length ? ans.coins.join('+') : '-', role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `coins=[${coins.join(', ')}] amount=${amount}`,
    en: `coins=[${coins.join(', ')}] amount=${amount}`,
  });

  const hooks: CoinChangeLexHooks = {
    onUpdate: (i, val) => {
      dp[i] = val;
      lastAmt = i;
      snap({
        zh: `dp[${i}]=${Number.isFinite(val) ? val : '∞'}`,
        en: `dp[${i}]=${Number.isFinite(val) ? val : '∞'}`,
      });
    },
    onDone: (cnt, ch) => {
      ans = { count: cnt, coins: ch };
      lastAmt = -1;
      snap({
        zh: cnt < 0 ? '无解' : `最少=${cnt} 方案=${ch.join('+')}`,
        en: cnt < 0 ? 'no solution' : `min=${cnt} plan=${ch.join('+')}`,
      });
    },
  };

  coinChangeLex(coins, amount, hooks);

  rec
    .begin({
      zh: ans.count < 0 ? '无解' : `完成：${ans.count} 枚`,
      en: ans.count < 0 ? 'No solution' : `Done: ${ans.count}`,
    })
    .setBars(coins.map((c) => ({ value: c, role: 'final' as BarRole })))
    .setAux([{ label: '方案', value: ans.coins.join('+') || '-', role: 'final' }])
    .commit();

  return rec.build();
}
