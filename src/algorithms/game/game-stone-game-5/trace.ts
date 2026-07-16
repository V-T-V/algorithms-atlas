// 石子游戏 V · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameStoneGame5, type GameStoneGame5Hooks } from './impl.ts';

export const DEFAULT_INPUT = [6, 2, 3, 4, 5, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `石子 [${input.join(', ')}]`, en: `Stones [${input.join(', ')}]` })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '目标', value: '求 Alice 最大得分', role: 'pivot' }])
    .commit();

  const hooks: GameStoneGame5Hooks = {
    onSplit: (i, k, j, ls, rs) => {
      const roles: BarRole[] = input.map((_, idx) => {
        if (idx >= i && idx <= k) return 'compare';
        if (idx > k && idx <= j) return 'warn';
        return 'default';
      });
      rec
        .begin({
          zh: `分割 [${i},${j}] 于 ${k}：左=${ls} 右=${rs}`,
          en: `Split [${i},${j}] at ${k}: L=${ls} R=${rs}`,
        })
        .setArray([...input], roles, [{ index: k, label: 'k' }])
        .commit();
    },
    onDp: (i, j, value) => {
      rec
        .begin({ zh: `dp[${i}][${j}] = ${value}`, en: `dp[${i}][${j}] = ${value}` })
        .setAux([{ label: `dp[${i}][${j}]`, value: String(value), role: 'final' }])
        .commit();
    },
  };

  const result = gameStoneGame5(input, hooks);

  rec
    .begin({ zh: `完成：最大得分 ${result}`, en: `Done: max score ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '最大得分', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
