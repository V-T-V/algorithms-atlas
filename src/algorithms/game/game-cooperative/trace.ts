// 合作博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameCooperative, type GameCooperativeHooks } from './impl.ts';

// 例：3 人合作，v(S) = 联盟规模的平方（有协同增效）
const v = (mask: number): number => {
  let cnt = 0;
  for (let i = 0; i < 3; i++) if (mask & (1 << i)) cnt++;
  return cnt * cnt;
};

export const DEFAULT_INPUT = { playerCount: 3, v };

export function buildTrace(
  input: { playerCount: number; v: (m: number) => number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { playerCount, v: vv } = input;

  rec
    .begin({
      zh: `${playerCount} 人合作博弈求 Shapley 值`,
      en: `Shapley values for ${playerCount}-player cooperative game`,
    })
    .setAux([{ label: 'players', value: String(playerCount), role: 'pivot' }])
    .commit();

  const hooks: GameCooperativeHooks = {
    onShapley: (player, value) => {
      rec
        .begin({
          zh: `玩家 ${player} Shapley = ${value.toFixed(3)}`,
          en: `Player ${player} Shapley = ${value.toFixed(3)}`,
        })
        .setBars([{ value, role: 'final' as BarRole }])
        .setAux([{ label: `φ(${player})`, value: value.toFixed(3), role: 'final' }])
        .commit();
    },
  };

  const result = gameCooperative(playerCount, vv, hooks);

  rec
    .begin({
      zh: `完成：Shapley [${result.map((x) => x.toFixed(2)).join(', ')}]`,
      en: `Done: Shapley [${result.map((x) => x.toFixed(2)).join(', ')}]`,
    })
    .setBars(result.map((x) => ({ value: x, role: 'final' as BarRole })))
    .setAux([{ label: '总和', value: result.reduce((a, b) => a + b, 0).toFixed(3), role: 'pivot' }])
    .commit();

  return rec.build();
}
