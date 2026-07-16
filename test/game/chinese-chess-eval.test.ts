import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateBoard,
  initialBoard,
  MATERIAL_VALUE,
  type ChessEvalHooks,
} from '../../src/algorithms/game/chinese-chess-eval/impl.ts';

function emptyBoard(): string[][] {
  return Array.from({ length: 10 }, () => new Array<string>(9).fill('.'));
}

test('chinese-chess-eval 初始局面双方对称，总分为 0', () => {
  const board = initialBoard();
  const r = evaluateBoard(board);
  assert.equal(r.score, 0, '初始局面双方子力位置对称，红视角总分应为 0');
  assert.equal(r.redMaterial, r.blackMaterial, '初始子力对称');
});

test('chinese-chess-eval 初始子力：每方 一帅两车两马两象两士双炮五兵', () => {
  const board = initialBoard();
  const r = evaluateBoard(board);
  // redMaterial 仅含子力（含帅；兵未过河不翻倍）
  const expected =
    MATERIAL_VALUE.K! +
    2 *
      (MATERIAL_VALUE.R! +
        MATERIAL_VALUE.H! +
        MATERIAL_VALUE.E! +
        MATERIAL_VALUE.A! +
        MATERIAL_VALUE.C!) +
    5 * MATERIAL_VALUE.P!;
  assert.equal(r.redMaterial, expected);
  assert.equal(r.blackMaterial, expected);
});

test('chinese-chess-eval 红多一车 → 正分', () => {
  const board = emptyBoard();
  board[9]![0] = 'R';
  board[9]![8] = 'R';
  board[0]![0] = 'r';
  // 红两车，黑一车 → 红多 900 + 位置差
  const r = evaluateBoard(board);
  assert.ok(r.score > 800, `红多一车应为大正分，实际 ${r.score}`);
});

test('chinese-chess-eval 黑多一马 → 负分', () => {
  const board = emptyBoard();
  board[0]![1] = 'h';
  board[0]![7] = 'h';
  board[9]![1] = 'H';
  // 红一马，黑两马 → 黑多 400
  const r = evaluateBoard(board);
  assert.ok(r.score < -300, `黑多一马应为负分，实际 ${r.score}`);
});

test('chinese-chess-eval 空棋盘得 0 分', () => {
  const r = evaluateBoard(emptyBoard());
  assert.equal(r.score, 0);
  assert.equal(r.redMaterial, 0);
  assert.equal(r.blackMaterial, 0);
});

test('chinese-chess-eval 兵过河价值翻倍', () => {
  const board1 = emptyBoard();
  board1[6]![4] = 'P'; // 红兵未过河
  const r1 = evaluateBoard(board1);
  const board2 = emptyBoard();
  board2[3]![4] = 'P'; // 红兵过河（r=3 <= 4）
  const r2 = evaluateBoard(board2);
  assert.ok(r2.score > r1.score, '过河兵应更值钱');
  assert.ok(r2.redMaterial === 2 * r1.redMaterial, '过河兵子力翻倍');
});

test('chinese-chess-eval 帅价值极高', () => {
  const board = emptyBoard();
  board[9]![4] = 'K';
  board[0]![4] = 'k';
  const r = evaluateBoard(board);
  // 双方都有帅 → 抵消
  assert.equal(r.redMaterial, r.blackMaterial);
});

test('chinese-chess-eval 钩子被调用', () => {
  let pieces = 0;
  let materials = 0;
  let scores = 0;
  const hooks: ChessEvalHooks = {
    onPiece: () => pieces++,
    onMaterial: () => materials++,
    onScore: () => scores++,
  };
  evaluateBoard(initialBoard(), hooks);
  // 初始 32 子
  assert.equal(pieces, 32);
  assert.equal(materials, 1);
  assert.equal(scores, 1);
});
