import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { calculateMinimumHP, type DungeonHooks } from './impl.ts';

export const DEFAULT_DUNGEON = [
  [-2, -3, 3],
  [-5, -10, 1],
  [10, 30, -5],
];

export function buildTrace(dungeon: readonly (readonly number[])[] = DEFAULT_DUNGEON): Frame[] {
  const rec = new TraceRecorder();
  const m = dungeon.length,
    n = dungeon[0]!.length;
  const need: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let ci = -1,
    cj = -1;
  rec
    .begin({ zh: `地下城 ${m}×${n}`, en: `Dungeon ${m}x${n}` })
    .setGrid(dungeon.map((row) => row.map((v) => ({ v: String(v), role: 'default' as BarRole }))))
    .commit();
  const hooks: DungeonHooks = {
    onCell: (i, j, val) => {
      need[i]![j] = val;
      ci = i;
      cj = j;
      rec
        .begin({ zh: `need[${i}][${j}]=${val}`, en: `need[${i}][${j}]=${val}` })
        .setGrid(
          need.map((row, r) =>
            row.map((v, c) => ({
              v: String(v),
              role: (r === ci && c === cj ? 'compare' : 'default') as BarRole,
            })),
          ),
        )
        .setAux([{ label: 'dmg', value: String(dungeon[i]![j]), role: 'warn' }])
        .commit();
    },
  };
  const ans = calculateMinimumHP(dungeon, hooks);
  rec
    .begin({ zh: `最小初始血量=${ans}`, en: `Min initial HP=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
