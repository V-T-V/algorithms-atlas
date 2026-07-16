// 猎鹿博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameStagHunt } from './impl.ts';

const ACTIONS = ['Stag', 'Hare'];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ROW: ReadonlyArray<readonly number[]> = [
    [4, 0],
    [2, 2],
  ];
  const COL: ReadonlyArray<readonly number[]> = [
    [4, 2],
    [0, 2],
  ];
  const grid = ROW.map((row, i) =>
    row.map((v, j) => ({ v: `${v},${COL[i]![j]}`, role: 'default' as BarRole })),
  );

  rec
    .begin({ zh: '猎鹿博弈（行,列 收益）', en: 'Stag Hunt (row,col payoffs)' })
    .setGrid(grid)
    .commit();

  gameStagHunt({
    onConclude: (nashCells, payoffDominant, riskDominant) => {
      const grid2 = grid.map((rowArr, i) =>
        rowArr.map((cell, j) => {
          let role: BarRole = 'default';
          if (nashCells.some(([a, b]) => a === i && b === j)) role = 'final';
          return { ...cell, role };
        }),
      );
      rec
        .begin({
          zh: `纳什 ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}`,
          en: `Nash ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}`,
        })
        .setGrid(grid2)
        .setAux([
          {
            label: '收益占优',
            value: `(${ACTIONS[payoffDominant[0]]},${ACTIONS[payoffDominant[1]]})`,
            role: 'compare',
          },
          {
            label: '风险占优',
            value: `(${ACTIONS[riskDominant[0]]},${ACTIONS[riskDominant[1]]})`,
            role: 'warn',
          },
        ])
        .commit();
    },
  });

  return rec.build();
}
