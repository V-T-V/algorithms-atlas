// 回合制游戏框架 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameTurnBased, type GameTurnBasedHooks } from './impl.ts';

export const DEFAULT_INPUT = { remaining: 8, maxTake: 3 };

export function buildTrace(input: { remaining: number; maxTake: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { remaining, maxTake } = input;
  const table = new Array<boolean>(remaining + 1).fill(false);

  rec
    .begin({
      zh: `剩 ${remaining} 颗，每轮取 1..${maxTake}`,
      en: `${remaining} stones, take 1..${maxTake} per turn`,
    })
    .setBars([{ value: remaining, role: 'pivot' as BarRole }])
    .setAux([{ label: 'maxTake', value: String(maxTake), role: 'pivot' }])
    .commit();

  const hooks: GameTurnBasedHooks = {
    onMemo: (r, winning) => {
      table[r] = winning;
      rec
        .begin({
          zh: `win[${r}] = ${winning ? '胜' : '败'}`,
          en: `win[${r}] = ${winning ? 'WIN' : 'LOSE'}`,
        })
        .setBars(table.map((w, i) => ({ value: i, role: (w ? 'final' : 'warn') as BarRole })))
        .setAux([
          { label: `win[${r}]`, value: winning ? 'WIN' : 'LOSE', role: winning ? 'final' : 'warn' },
        ])
        .commit();
    },
  };

  const result = gameTurnBased(remaining, maxTake, hooks);

  rec
    .begin({
      zh: `结论：先手${result ? '必胜' : '必败'}`,
      en: `Result: first player ${result ? 'wins' : 'loses'}`,
    })
    .setAux([{ label: '结论', value: result ? 'WIN' : 'LOSE', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
