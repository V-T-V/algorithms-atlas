// =============================================================================
// 地下城游戏 · 录制（逆向）
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { calculateMinimumHP, type DungeonHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  [-2, -3, 3],
  [-5, -10, 1],
  [10, 30, -5],
];

export function buildTrace(dungeon: readonly (readonly number[])[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const m = dungeon.length;
  const n = dungeon[0]!.length;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let cur = { i: 0, j: 0 };

  const snap = (note: { zh: string; en: string }): void => {
    const g: Cell[][] = dungeon.map((row, i) =>
      row.map((v, j) => ({
        v: `${v}/${dp[i]![j]!}`,
        role: i === cur.i && j === cur.j ? 'compare' : 'default',
      })),
    );
    rec.begin(note).setGrid(g).commit();
  };

  snap({ zh: `${m}×${n} 地下城`, en: `${m}x${n} dungeon` });

  const hooks: DungeonHooks = {
    onCell: (i, j, need) => {
      dp[i]![j] = need;
      cur = { i, j };
      snap({ zh: `(${i},${j}) 进入需血=${need}`, en: `(${i},${j}) need=${need}` });
    },
  };

  const ans = calculateMinimumHP(dungeon, hooks);

  rec
    .begin({ zh: `所需初始血量=${ans}`, en: `Min initial HP=${ans}` })
    .setAux([{ label: '初始血量', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
