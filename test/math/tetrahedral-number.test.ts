import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tetrahedral,
  tetrahedralSequence,
  isTetrahedral,
} from '../../src/algorithms/math/tetrahedral-number/impl.ts';

test('tetrahedral 公式', () => {
  // 1, 4, 10, 20, 35, 56, 84, 120
  assert.equal(tetrahedral(1), 1);
  assert.equal(tetrahedral(2), 4);
  assert.equal(tetrahedral(3), 10);
  assert.equal(tetrahedral(4), 20);
  assert.equal(tetrahedral(5), 35);
  assert.equal(tetrahedral(6), 56);
});

test('tetrahedral 序列', () => {
  assert.deepEqual(tetrahedralSequence(5), [1, 4, 10, 20, 35]);
});

test('tetrahedral 判定是', () => {
  assert.equal(isTetrahedral(10).isTetrahedral, true);
  assert.equal(isTetrahedral(10).rank, 3);
  assert.equal(isTetrahedral(20).rank, 4);
  assert.equal(isTetrahedral(84).rank, 7);
});

test('tetrahedral 判定否', () => {
  assert.equal(isTetrahedral(5).isTetrahedral, false);
  assert.equal(isTetrahedral(11).isTetrahedral, false);
  assert.equal(isTetrahedral(100).isTetrahedral, false);
});

test('tetrahedral 边界', () => {
  assert.equal(isTetrahedral(0).isTetrahedral, false);
  assert.equal(isTetrahedral(1).isTetrahedral, true);
  assert.equal(isTetrahedral(1).rank, 1);
});

test('tetrahedral 大数正确', () => {
  // Te(20) = 20·21·22/6 = 1540
  assert.equal(tetrahedral(20), 1540);
  assert.equal(isTetrahedral(1540).rank, 20);
});

test('tetrahedral 钩子被调用', () => {
  const seq: number[] = [];
  tetrahedralSequence(4, { onTerm: (_i, v) => seq.push(v) });
  assert.deepEqual(seq, [1, 4, 10, 20]);
});
