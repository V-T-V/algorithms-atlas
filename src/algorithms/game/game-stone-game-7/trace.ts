// 石子游戏 VII · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameStoneGame7, type GameStoneGame7Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 3, 1, 4, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `石子 [${input.join(', ')}]`, en: `Stones [${input.join(', ')}]` })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '目标', value: '求最大分差', role: 'pivot' }])
    .commit();

  const hooks: GameStoneGame7Hooks = {
    onDp: (i, j, diff) => {
      rec
        .begin({ zh: `dp[${i}][${j}] = ${diff}`, en: `dp[${i}][${j}] = ${diff}` })
        .setAux([{ label: `dp[${i}][${j}]`, value: String(diff), role: 'final' }])
        .commit();
    },
  };

  const result = gameStoneGame7(input, hooks);

  rec
    .begin({ zh: `完成：最大分差 ${result}`, en: `Done: max diff ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '分差', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
