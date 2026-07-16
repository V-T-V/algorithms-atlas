// 鹰鸽博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameHawkDove } from './impl.ts';

const ACTIONS = ['Hawk', 'Dove'];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const V = 50;
  const C = 100;
  const HH = (V - C) / 2;
  const HD = V;
  const DH = 0;
  const DD = V / 2;
  const ROW: ReadonlyArray<readonly number[]> = [
    [HH, HD],
    [DH, DD],
  ];
  const grid = ROW.map((row, i) =>
    row.map((v, j) => ({ v: `${v},${ROW[j]![i]}`, role: 'default' as BarRole })),
  );

  rec
    .begin({
      zh: `鹰鸽博弈 V=${V} C=${C}（行,列 收益）`,
      en: `Hawk-Dove V=${V} C=${C} (row,col payoffs)`,
    })
    .setGrid(grid)
    .commit();

  gameHawkDove(V, C, {
    onConclude: (nashCells, essHawkFreq) => {
      const grid2 = grid.map((rowArr, i) =>
        rowArr.map((cell, j) => ({
          ...cell,
          role: (nashCells.some(([a, b]) => a === i && b === j) ? 'final' : 'default') as BarRole,
        })),
      );
      rec
        .begin({
          zh: `纯纳什 ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}；ESS 鹰频率 ${essHawkFreq.toFixed(3)}`,
          en: `Pure Nash ${nashCells.map(([a, b]) => `(${ACTIONS[a]},${ACTIONS[b]})`).join(' ')}; ESS hawk freq ${essHawkFreq.toFixed(3)}`,
        })
        .setGrid(grid2)
        .setAux([
          { label: '纯纳什数', value: String(nashCells.length), role: 'final' },
          { label: 'ESS P(Hawk)', value: essHawkFreq.toFixed(3), role: 'warn' },
        ])
        .commit();
    },
  });

  return rec.build();
}
