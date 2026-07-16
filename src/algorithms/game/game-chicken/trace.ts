// 胆小鬼博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameChicken } from './impl.ts';

const ACTIONS = ['Straight', 'Swerve'];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ROW: ReadonlyArray<readonly number[]> = [
    [-6, 1],
    [-1, 0],
  ];
  const COL: ReadonlyArray<readonly number[]> = [
    [-6, -1],
    [1, 0],
  ];
  const grid = ROW.map((row, i) =>
    row.map((v, j) => ({ v: `${v},${COL[i]![j]}`, role: 'default' as BarRole })),
  );

  rec
    .begin({ zh: '胆小鬼博弈（行,列 收益）', en: 'Game of Chicken (row,col payoffs)' })
    .setGrid(grid)
    .commit();

  gameChicken({
    onConclude: (nashCells, mixedProb) => {
      const grid2 = grid.map((rowArr, i) =>
        rowArr.map((cell, j) => ({
          ...cell,
          role: (nashCells.some(([a, b]) => a === i && b === j) ? 'final' : 'default') as BarRole,
        })),
      );
      rec
        .begin({
          zh: `纯纳什 ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}；混合 P(S)=${mixedProb.toFixed(3)}`,
          en: `Pure Nash ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}; mixed P(S)=${mixedProb.toFixed(3)}`,
        })
        .setGrid(grid2)
        .setAux([
          { label: '纯纳什数', value: String(nashCells.length), role: 'final' },
          { label: 'P(Straight)', value: mixedProb.toFixed(3), role: 'warn' },
        ])
        .commit();
    },
  });

  return rec.build();
}
