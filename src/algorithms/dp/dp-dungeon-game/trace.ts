// =============================================================================
// 地下城游戏 · 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dungeonGame, type DungeonHooks } from './impl.ts';

export const DEFAULT_DUNGEON: ReadonlyArray<readonly number[]> = [
  [-2, -3, 3],
  [-5, -10, 1],
  [10, 30, -5],
];

export function buildTrace(dungeon: ReadonlyArray<readonly number[]> = DEFAULT_DUNGEON): Frame[] {
  const rec = new TraceRecorder();
  const m = dungeon.length;
  const n = dungeon[0]?.length ?? 0;
  const need: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let pi = -1;
  let pj = -1;
  let ans = 1;

  const render = (note: { zh: string; en: string }): void => {
    const rows: Cell[][] = dungeon.map((row, i) =>
      row.map((d, j) => ({
        v: `d:${d}/h:${need[i]![j] ?? '-'}`,
        role: (i === pi && j === pj ? 'pivot' : 'default') as Cell['role'],
      })),
    );
    rec
      .begin(note)
      .setGrid(rows)
      .setAux([{ label: '当前位置', value: pi < 0 ? '-' : `(${pi},${pj})`, role: 'pivot' }])
      .commit();
  };

  render({ zh: '地下城网格', en: 'Dungeon grid' });

  const hooks: DungeonHooks = {
    onCell: (i, j, val) => {
      need[i]![j] = val;
      pi = i;
      pj = j;
      render({ zh: `need[${i}][${j}]=${val}`, en: `need[${i}][${j}]=${val}` });
    },
    onDone: (h) => {
      ans = h;
      pi = -1;
      pj = -1;
      render({ zh: `最少初始血量=${h}`, en: `min initial HP=${h}` });
    },
  };

  dungeonGame(dungeon, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: '最少初始血量', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
