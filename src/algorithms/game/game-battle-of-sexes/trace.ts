// 性别战博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameBattleOfSexes } from './impl.ts';

const ACTIONS = ['Opera', 'Football'];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ROW: ReadonlyArray<readonly number[]> = [
    [3, 0],
    [0, 2],
  ];
  const COL: ReadonlyArray<readonly number[]> = [
    [2, 0],
    [0, 3],
  ];
  const grid = ROW.map((row, i) =>
    row.map((v, j) => ({ v: `${v},${COL[i]![j]}`, role: 'default' as BarRole })),
  );

  rec
    .begin({ zh: '性别战（丈夫,妻子 收益）', en: 'Battle of Sexes (husband,wife payoffs)' })
    .setGrid(grid)
    .commit();

  gameBattleOfSexes({
    onConclude: (nashCells, mixedRowProb, mixedColProb) => {
      const grid2 = grid.map((rowArr, i) =>
        rowArr.map((cell, j) => ({
          ...cell,
          role: (nashCells.some(([a, b]) => a === i && b === j) ? 'final' : 'default') as BarRole,
        })),
      );
      rec
        .begin({
          zh: `纯纳什 ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}；混合 丈夫O=${mixedRowProb.toFixed(2)} 妻子O=${mixedColProb.toFixed(2)}`,
          en: `Pure Nash ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}; mixed husbandO=${mixedRowProb.toFixed(2)} wifeO=${mixedColProb.toFixed(2)}`,
        })
        .setGrid(grid2)
        .setAux([
          { label: '纯纳什数', value: String(nashCells.length), role: 'final' },
          { label: '丈夫P(O)', value: mixedRowProb.toFixed(2), role: 'compare' },
          { label: '妻子P(O)', value: mixedColProb.toFixed(2), role: 'warn' },
        ])
        .commit();
    },
  });

  return rec.build();
}
