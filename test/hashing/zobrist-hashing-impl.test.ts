import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ZobristHash, mulberry32 } from '../../src/algorithms/hashing/zobrist-hashing-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/zobrist-hashing-impl/trace.ts';

test('Zobrist 空棋盘哈希为 0', () => {
  const zh = new ZobristHash(4, 4, 3);
  assert.equal(zh.hash, 0);
});

test('Zobrist computeFromBoard 输出 32 位无符号', () => {
  const zh = new ZobristHash(4, 4, 3);
  const h = zh.computeFromBoard([
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 1],
  ]);
  assert.ok(h >= 0 && h < 0x100000000);
});

test('Zobrist 同一棋盘哈希相同（确定性）', () => {
  const board = [
    [1, 0],
    [0, 2],
  ];
  const a = new ZobristHash(2, 2, 3).computeFromBoard(board);
  const b = new ZobristHash(2, 2, 3).computeFromBoard(board);
  assert.equal(a, b);
});

test('Zobrist 不同棋盘大概率不同', () => {
  const zh = new ZobristHash(4, 4, 3);
  const a = zh.computeFromBoard([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  zh.reset();
  const b = zh.computeFromBoard([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
  ]);
  assert.notEqual(a, b);
});

test('Zobrist 增量移动 = 全量重算', () => {
  const board = [
    [1, 0],
    [0, 2],
  ];
  const zh = new ZobristHash(2, 2, 3);
  zh.computeFromBoard(board);
  // 增量：把 (0,0) 的 1 移到 (1,1) 处会冲突，改为移到 (0,1)
  zh.movePiece(0, 0, 0, 1, 1);
  const incrementalHash = zh.hash;
  // 全量重算
  const newBoard = [
    [0, 1],
    [0, 2],
  ];
  const zh2 = new ZobristHash(2, 2, 3);
  const fullHash = zh2.computeFromBoard(newBoard);
  assert.equal(incrementalHash, fullHash, '增量更新与全量重算应一致');
});

test('Zobrist toggle 自反：放置再移除恢复原哈希', () => {
  const zh = new ZobristHash(4, 4, 3);
  const h0 = zh.hash;
  zh.togglePiece(1, 1, 1);
  zh.togglePiece(1, 1, 1);
  assert.equal(zh.hash, h0);
});

test('Zobrist place + remove 等价于无操作', () => {
  const zh = new ZobristHash(4, 4, 3);
  const h0 = zh.hash;
  zh.placePiece(2, 2, 2);
  zh.removePiece(2, 2, 2);
  assert.equal(zh.hash, h0);
});

test('Zobrist 非法参数抛错', () => {
  assert.throws(() => new ZobristHash(0, 4, 3));
  assert.throws(() => new ZobristHash(4, 0, 3));
});

test('Zobrist randomFor 越界抛错', () => {
  const zh = new ZobristHash(4, 4, 3);
  assert.throws(() => zh.randomFor(3, 0, 0)); // piece >= numPieces
});

test('mulberry32 确定性', () => {
  const r1 = mulberry32(12345);
  const r2 = mulberry32(12345);
  for (let i = 0; i < 10; i++) assert.equal(r1(), r2());
});

test('Zobrist 钩子：onToggle 触发', () => {
  const zh = new ZobristHash(4, 4, 3);
  let toggles = 0;
  zh.togglePiece(0, 0, 1, { onToggle: () => toggles++ });
  assert.equal(toggles, 1);
});

test('Zobrist 钩子：onMove 触发', () => {
  const zh = new ZobristHash(4, 4, 3);
  let moves = 0;
  zh.movePiece(0, 0, 1, 1, 1, { onMove: () => moves++ });
  assert.equal(moves, 1);
});

test('buildTrace 含 array2d（grid）与 aux，末帧含最终哈希', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 grid');
  const last = frames[frames.length - 1]!;
  const h = last.aux!.find((e) => e.label === '棋盘哈希');
  assert.ok(h, '末帧应含棋盘哈希');
});
