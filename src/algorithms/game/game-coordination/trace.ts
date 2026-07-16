// 协调博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameCoordination } from './impl.ts';

const ACTIONS = ['A', 'B'];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ROW: ReadonlyArray<readonly number[]> = [
    [2, 0],
    [0, 1],
  ];
  const grid = ROW.map((row) => row.map((v) => ({ v: `${v},${v}`, role: 'default' as BarRole })));

  rec
    .begin({ zh: '协调博弈（行,列 收益）', en: 'Coordination Game (row,col payoffs)' })
    .setGrid(grid)
    .commit();

  gameCoordination({
    onConclude: (nashCells, paretoDominant) => {
      const grid2 = grid.map((rowArr, i) =>
        rowArr.map((cell, j) => {
          let role: BarRole = 'default';
          if (i === paretoDominant[0] && j === paretoDominant[1]) role = 'final';
          else if (nashCells.some(([a, b]) => a === i && b === j)) role = 'compare';
          return { ...cell, role };
        }),
      );
      rec
        .begin({
          zh: `纯纳什 ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}；帕累托占优 (${ACTIONS[paretoDominant[0]]},${ACTIONS[paretoDominant[1]]})`,
          en: `Pure Nash ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}; pareto-dominant (${ACTIONS[paretoDominant[0]]},${ACTIONS[paretoDominant[1]]})`,
        })
        .setGrid(grid2)
        .setAux([
          { label: '纳什数', value: String(nashCells.length), role: 'compare' },
          {
            label: '帕累托最优',
            value: `(${ACTIONS[paretoDominant[0]]},${ACTIONS[paretoDominant[1]]})`,
            role: 'final',
          },
        ])
        .commit();
    },
  });

  return rec.build();
}
