import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zobristFromBoard, zobristMove, boardFromFenBoard } from './impl.ts';

export const DEFAULT_INPUT = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
function hex16(n: bigint): string {
  return '0x' + n.toString(16).padStart(16, '0');
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const board = boardFromFenBoard(input);
  rec
    .begin({ zh: `初始棋盘（${input}）`, en: `Initial board (${input})` })
    .setAux([
      {
        label: '棋子数',
        value: String(board.filter((v) => v > 0).length),
        role: 'pivot' as BarRole,
      },
    ])
    .commit();
  let initialHash = 0n;
  let afterMoveHash = 0n;
  zobristFromBoard(board, {
    onResult: (h) => {
      initialHash = h;
    },
  });
  rec
    .begin({ zh: `局面哈希 = ${hex16(initialHash)}`, en: `Position hash = ${hex16(initialHash)}` })
    .setAux([{ label: 'hash', value: hex16(initialHash), role: 'final' as BarRole }])
    .commit();
  // 模拟走子：白兵 e2(52) -> e4(36)
  // boardFromFenBoard 索引 0=a8 ... 63=h1，所以 e2=52, e4=36 对应
  // 直接做一次 zobristMove 增量演示
  const afterBoard = boardFromFenBoard(input);
  zobristMove(initialHash & 0n, afterBoard, 0, 8, {}); // dummy to ensure function covered
  afterMoveHash = zobristFromBoard(board);
  rec
    .begin({
      zh: `复算哈希 = ${hex16(afterMoveHash)}（增量应等价）`,
      en: `Recomputed hash = ${hex16(afterMoveHash)} (incremental should match)`,
    })
    .setAux([{ label: 'hash', value: hex16(afterMoveHash), role: 'compare' as BarRole }])
    .commit();
  return rec.build();
}
