// 石子游戏 VI · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameStoneGame6, type GameStoneGame6Hooks } from './impl.ts';

export const DEFAULT_INPUT = { aliceValues: [1, 3], bobValues: [2, 1] };

export function buildTrace(
  input: { aliceValues: number[]; bobValues: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { aliceValues, bobValues } = input;
  const sums = aliceValues.map((v, i) => v + bobValues[i]!);

  rec
    .begin({
      zh: `Alice=${JSON.stringify(aliceValues)} Bob=${JSON.stringify(bobValues)}`,
      en: `Alice=${JSON.stringify(aliceValues)} Bob=${JSON.stringify(bobValues)}`,
    })
    .setBars(sums.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: '排序键', value: 'a[i]+b[i] 降序', role: 'pivot' }])
    .commit();

  const hooks: GameStoneGame6Hooks = {
    onPick: (player, index) => {
      rec
        .begin({
          zh: `${player === 0 ? 'Alice' : 'Bob'} 取下标 ${index}`,
          en: `${player === 0 ? 'Alice' : 'Bob'} takes idx ${index}`,
        })
        .setBars(
          sums.map((v, i) => ({
            value: v,
            role: (i === index ? (player === 0 ? 'compare' : 'warn') : 'default') as BarRole,
          })),
        )
        .commit();
    },
    onScore: (alice, bob) => {
      rec
        .begin({ zh: `比分 Alice ${alice} : Bob ${bob}`, en: `Score Alice ${alice} : Bob ${bob}` })
        .setAux([
          { label: 'Alice', value: String(alice), role: 'compare' },
          { label: 'Bob', value: String(bob), role: 'warn' },
        ])
        .commit();
    },
  };

  const result = gameStoneGame6(aliceValues, bobValues, hooks);

  rec
    .begin({
      zh: `结论：${result === 1 ? 'Alice 胜' : result === 0 ? '平局' : 'Bob 胜'}`,
      en: `Result: ${result === 1 ? 'Alice wins' : result === 0 ? 'Draw' : 'Bob wins'}`,
    })
    .setAux([
      {
        label: '结论',
        value: result === 1 ? 'Alice' : result === 0 ? 'Draw' : 'Bob',
        role: result === 0 ? 'default' : 'final',
      },
    ])
    .commit();

  return rec.build();
}
