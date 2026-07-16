// =============================================================================
// 零钱兑换组合数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinChangeCount, type CoinChangeCountHooks } from './impl.ts';

export const DEFAULT_COINS = [1, 2, 5];
export const DEFAULT_AMOUNT = 5;

export function buildTrace(
  coins: readonly number[] = DEFAULT_COINS,
  amount: number = DEFAULT_AMOUNT,
): Frame[] {
  const rec = new TraceRecorder();
  const dp: number[] = new Array<number>(amount + 1).fill(0);
  dp[0] = 1;
  let curCoin = -1;
  let lastUpdate = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = dp.map((_, j) =>
      j === lastUpdate ? 'compare' : j === amount ? 'pivot' : dp[j]! > 0 ? 'frontier' : 'default',
    );
    rec
      .begin(note)
      .setArray(dp, roles, [{ index: lastUpdate < 0 ? 0 : lastUpdate, label: 'j' }])
      .setAux([
        { label: 'dp', value: dp.map((v) => `${v}`).join(' '), role: 'frontier' },
        { label: '当前硬币', value: curCoin < 0 ? '-' : `${coins[curCoin]}`, role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `coins=[${coins.join(', ')}] amount=${amount}`,
    en: `coins=[${coins.join(', ')}] amount=${amount}`,
  });

  const hooks: CoinChangeCountHooks = {
    onCoin: (i) => {
      curCoin = i;
      snap({ zh: `加入硬币 ${coins[i]}`, en: `Add coin ${coins[i]}` });
    },
    onUpdate: (j, val) => {
      dp[j] = val;
      lastUpdate = j;
      snap({ zh: `dp[${j}] = ${val}`, en: `dp[${j}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      lastUpdate = -1;
      curCoin = -1;
      snap({ zh: `组合数 = ${t}`, en: `Count = ${t}` });
    },
  };

  coinChangeCount(coins, amount, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(coins.map((c) => ({ value: c, role: 'final' as BarRole })))
    .setAux([{ label: '组合数 / count', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
