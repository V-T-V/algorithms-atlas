import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chessEval, ticTacToeEval } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化评估器`, en: `Init evaluator` })
    .setAux([{ label: '说明', value: '加权特征', role: 'compare' as BarRole }])
    .commit();

  rec
    .begin({ zh: `国际象棋评估 物质=+3 机动=+10`, en: `chess eval material=+3 mobility=+10` })
    .setBars([
      { value: 3, role: 'final' as BarRole, label: '物质×1' },
      { value: 1, role: 'compare' as BarRole, label: '机动×0.1' },
    ])
    .setAux([{ label: '总分', value: String(chessEval(3, 10)), role: 'final' as BarRole }])
    .commit();

  const board = [
    [1, 1, 0],
    [-1, -1, 0],
    [0, 0, 0],
  ];
  const tttScore = ticTacToeEval(board);
  rec
    .begin({ zh: `井字棋评估 =${tttScore}`, en: `ttt eval =${tttScore}` })
    .setGrid(
      board.map((row) =>
        row.map((v) => ({ v: v === 1 ? 'X' : v === -1 ? 'O' : '.', role: 'default' as BarRole })),
      ),
    )
    .setAux([{ label: '评估', value: String(tttScore), role: 'final' as BarRole }])
    .commit();

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([{ label: '说明', value: '评估演示', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
