// 银币游戏 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameSilverDollar, type GameSilverDollarHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 2, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const max = Math.max(...input, 0);

  rec
    .begin({
      zh: `硬币位置 [${input.join(', ')}]`,
      en: `Coin positions [${input.join(', ')}]`,
    })
    .setBars(
      Array.from({ length: max + 1 }, (_, i) => ({
        value: 1,
        role: (input.includes(i) ? 'final' : 'default') as BarRole,
      })),
    )
    .commit();

  const hooks: GameSilverDollarHooks = {
    onGap: (index, gap) => {
      rec
        .begin({ zh: `间隔 ${index}：${gap}`, en: `Gap ${index}: ${gap}` })
        .setAux([{ label: `gap(${index})`, value: String(gap), role: 'compare' as BarRole }])
        .commit();
    },
    onXor: (xorSum) => {
      rec
        .begin({ zh: `异或和 = ${xorSum}`, en: `xor sum = ${xorSum}` })
        .setAux([{ label: 'xor', value: String(xorSum), role: 'pivot' }])
        .commit();
    },
  };

  const firstWins = gameSilverDollar(input, hooks);

  rec
    .begin({
      zh: `结论：先手${firstWins ? '必胜' : '必败'}`,
      en: `Result: first player ${firstWins ? 'wins' : 'loses'}`,
    })
    .setAux([
      { label: '结论', value: firstWins ? 'WIN' : 'LOSE', role: firstWins ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
