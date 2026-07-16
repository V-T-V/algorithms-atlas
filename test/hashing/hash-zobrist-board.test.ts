import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zobristHash, zobristMove } from '../../src/algorithms/hashing/hash-zobrist-board/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-zobrist-board/trace.ts';
test('相同棋盘哈希相同', () => {
  const b = [0, 1, -1];
  assert.equal(zobristHash(b), zobristHash([...b]));
});
test('移动改变哈希', () => {
  const b = [0, -1];
  const h0 = zobristHash(b);
  const h1 = zobristMove(h0, 0, 1, 0);
  assert.notEqual(h0, h1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
