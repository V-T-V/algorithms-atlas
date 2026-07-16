// =============================================================================
// 概率 DP（二项分布）· 录制帧序列
// 用二维 grid 展示 dp 表：行 = 抛硬币数 i，列 = 正面数 j。
// 当前填格 'compare'，目标答案格 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { probabilityDp, type CoinTossInput } from './impl.ts';

/** 演示：抛 6 枚硬币、正面概率 0.5，求恰好 3 枚正面（= C(6,3)/64 = 20/64 = 0.3125）。 */
export const DEFAULT_INPUT: CoinTossInput = { n: 6, p: 0.5, k: 3 };

const pct = (x: number): string => (x === 0 ? '0' : (x * 100).toFixed(1) + '%');
const rnd = (x: number): number => Math.round(x * 10000) / 10000;

/** 录制演示帧序列。 */
export function buildTrace(input: CoinTossInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(-1));
  let curI = -1;
  let curJ = -1;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j <= n; j++) header.push({ v: j, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i <= n; i++) {
      const row: Cell[] = [{ v: i, role: 'pivot' }];
      for (let j = 0; j <= n; j++) {
        let role: BarRole = 'default';
        if (i === n && j === k) role = 'final';
        else if (curI === i && curJ === j) role = 'compare';
        const val = dp[i]![j]!;
        row.push({ v: val < 0 ? '·' : rnd(val), role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        { label: '硬币数 n', value: String(n) },
        { label: '正面概率 p', value: pct(input.p) },
        { label: '目标 k', value: String(k) },
      ])
      .commit();
  };

  snapshot({
    zh: `抛 ${n} 枚硬币，正面概率 ${pct(input.p)}，求恰好 ${k} 枚正面`,
    en: `Toss ${n} coins, P(heads)=${pct(input.p)}, find P(exactly ${k} heads)`,
  });

  const hooks = {
    onFillCell: (i: number, j: number, prob: number) => {
      dp[i]![j] = prob;
      curI = i;
      curJ = j;
      snapshot({
        zh: `dp[${i}][${j}] = ${rnd(prob)}`,
        en: `dp[${i}][${j}] = ${rnd(prob)}`,
      });
    },
    onDone: () => {},
  };

  const result = probabilityDp(input, hooks);

  // 终态
  curI = -1;
  curJ = -1;
  rec
    .begin({
      zh: `P(恰好 ${k} 枚正面) = ${rnd(result.prob)}（${pct(result.prob)}）`,
      en: `P(exactly ${k} heads) = ${rnd(result.prob)} (${pct(result.prob)})`,
    })
    .setGrid(renderGrid())
    .setAux([
      {
        label: '答案 / answer',
        value: `${rnd(result.prob)}（${pct(result.prob)}）`,
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
