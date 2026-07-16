// =============================================================================
// 取硬币博弈 · 录制帧序列
// 可视化：setBars 渲染 SG 值序列；setAux 展示 n/m/判定/取法。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinChangeGame, type CoinChangeGameHooks } from './impl.ts';

export interface CcgInput {
  n: number;
  m: number;
}
export const DEFAULT_INPUT: CcgInput = { n: 10, m: 4 };

/** 录制演示帧序列。 */
export function buildTrace(input: CcgInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, m } = input;

  rec
    .begin({
      zh: `n=${n} 枚硬币，每次取 1..${m}，取最后一枚者胜`,
      en: `n=${n} coins, take 1..${m} each turn, last coin wins`,
    })
    .setBars([{ value: 0, role: 'default' }])
    .setAux([
      { label: 'n', value: String(n), role: 'default' },
      { label: 'm', value: String(m), role: 'default' },
      { label: '判定', value: '(n mod (m+1))=' + String(n % (m + 1)), role: 'pivot' },
    ])
    .commit();

  const sgArr: number[] = [0];
  const hooks: CoinChangeGameHooks = {
    onSG: (coins, sg) => {
      sgArr[coins] = sg;
      rec
        .begin({
          zh: `SG(${coins}) = ${sg}${sg !== 0 ? '（必胜态）' : '（必败态）'}`,
          en: `SG(${coins}) = ${sg}${sg !== 0 ? ' (winning)' : ' (losing)'}`,
        })
        .setBars(sgArr.map((v) => ({ value: v, role: (v === 0 ? 'warn' : 'compare') as BarRole })))
        .setAux([
          { label: '当前 SG', value: String(sg), role: sg !== 0 ? 'final' : 'warn' },
          { label: '已算状态', value: String(coins + 1), role: 'default' },
        ])
        .commit();
    },
  };

  const result = coinChangeGame(n, m, hooks);

  rec
    .begin({
      zh: result.firstWins
        ? `先手必胜：必胜取法为取 ${result.winningMove} 枚`
        : `先手必败：n 是 (m+1)=${m + 1} 的倍数`,
      en: result.firstWins
        ? `First wins: take ${result.winningMove} coins`
        : `First loses: n is a multiple of (m+1)=${m + 1}`,
    })
    .setBars(result.sg.map((v) => ({ value: v, role: (v === 0 ? 'warn' : 'final') as BarRole })))
    .setAux([
      { label: 'n', value: String(n), role: 'default' },
      { label: 'm', value: String(m), role: 'default' },
      {
        label: '判定',
        value: result.firstWins ? '先手必胜' : '先手必败',
        role: result.firstWins ? 'final' : ('warn' as BarRole),
      },
      ...(result.winningMove > 0
        ? [{ label: '必胜取法', value: `取 ${result.winningMove}`, role: 'final' as BarRole }]
        : []),
    ])
    .commit();

  return rec.build();
}
