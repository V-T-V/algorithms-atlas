import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  zobristFromBoard,
  zobristMove,
  boardFromFenBoard,
} from '../../src/algorithms/hashing/hash-zobrist-chess/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/hash-zobrist-chess/trace.ts';

test('zobrist 确定性', () => {
  const b1 = boardFromFenBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  const b2 = boardFromFenBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  assert.equal(zobristFromBoard(b1), zobristFromBoard(b2));
});
test('zobrist 不同局面不同', () => {
  const b1 = boardFromFenBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  const b2 = boardFromFenBoard('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
  assert.notEqual(zobristFromBoard(b1), zobristFromBoard(b2));
});
test('zobrist 增量走子一致', () => {
  // 初始局面白兵 e2->e4
  const start = boardFromFenBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  const h0 = zobristFromBoard(start);
  // 增量走子：e2(52) -> e4(36)
  const moving = boardFromFenBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  const hMove = zobristMove(h0, moving, 52, 36);
  // 重新复算
  const after = boardFromFenBoard('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
  const hAfter = zobristFromBoard(after);
  assert.equal(hMove, hAfter);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
