// 帕累托最优 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameParetoOptimal } from './impl.ts';

const ACTIONS = ['A', 'B'];
const ROW: ReadonlyArray<readonly number[]> = [
  [3, 5],
  [1, 4],
];
const COL: ReadonlyArray<readonly number[]> = [
  [3, 1],
  [5, 4],
];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const grid = ROW.map((row, i) =>
    row.map((v, j) => ({ v: `${v},${COL[i]![j]}`, role: 'default' as BarRole })),
  );
  rec
    .begin({ zh: '帕累托最优（行,列 收益）', en: 'Pareto Optimality (row,col payoffs)' })
    .setGrid(grid)
    .commit();
  gameParetoOptimal({
    onConclude: (nashCells, socialOptimum) => {
      const nashStr = nashCells.map(([i, j]) => `(${ACTIONS[i]},${ACTIONS[j]})`).join(' ');
      const socStr = `(${ACTIONS[socialOptimum[0]]},${ACTIONS[socialOptimum[1]]})`;
      const grid2 = grid.map((rowArr, i) =>
        rowArr.map((cell, j) => {
          let role: BarRole = 'default';
          if (nashCells.some(([a, b]) => a === i && b === j)) role = 'final';
          else if (i === socialOptimum[0] && j === socialOptimum[1]) role = 'compare';
          return { ...cell, role };
        }),
      );
      rec
        .begin({
          zh: `纳什: ${nashStr || '无'} | 社会最优: ${socStr}`,
          en: `Nash: ${nashStr || 'none'} | Social optimum: ${socStr}`,
        })
        .setGrid(grid2)
        .setAux([
          { label: '纳什', value: nashStr || '无', role: 'final' },
          { label: '社会最优', value: socStr, role: 'compare' },
        ])
        .commit();
    },
  });
  return rec.build();
}
