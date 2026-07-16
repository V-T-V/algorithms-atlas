import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BlockArray, blockArray } from '../../src/algorithms/ds/block-array/impl.ts';

test('block-array 区间加 + 单点查 基本行为', () => {
  const ba = new BlockArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  ba.addRange(0, 8, 10); // 全加 10
  assert.deepEqual(ba.toArray(), [11, 12, 13, 14, 15, 16, 17, 18, 19]);
  ba.addRange(2, 6, 100); // 中段加 100
  assert.equal(ba.query(0), 11);
  assert.equal(ba.query(2), 113); // 左散块
  assert.equal(ba.query(4), 115); // 整块（带 tag）
  assert.equal(ba.query(6), 117); // 右散块
  assert.equal(ba.query(8), 19);
});

test('block-array 单块内区间加', () => {
  const ba = new BlockArray([5, 5, 5, 5, 5]);
  ba.addRange(1, 3, 1);
  assert.deepEqual(ba.toArray(), [5, 6, 6, 6, 5]);
});

test('block-array 边界与越界', () => {
  const ba = new BlockArray([1, 2, 3]);
  ba.addRange(-5, 100, 7); // 越界自动裁剪
  assert.deepEqual(ba.toArray(), [8, 9, 10]);
  ba.addRange(2, 1, 5); // 空：不动
  assert.deepEqual(ba.toArray(), [8, 9, 10]);
});

test('blockArray 便利函数批量操作', () => {
  const out = blockArray({
    values: [1, 1, 1, 1, 1, 1, 1, 1],
    ops: [
      { l: 0, r: 7, v: 1 },
      { l: 0, r: 3, v: 2 },
      { l: 4, r: 7, v: 3 },
    ],
  });
  assert.deepEqual(out, [4, 4, 4, 4, 5, 5, 5, 5]);
});

test('block-array 钩子被调用', () => {
  let visits = 0;
  let tags = 0;
  let queries = 0;
  const ba = new BlockArray([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // 跨块：必触发散块 onVisit 和整块 onBlockTag
  ba.addRange(1, 7, 1, {
    onVisit: () => visits++,
    onBlockTag: () => tags++,
  });
  assert.ok(visits > 0, '散块应触发 onVisit');
  assert.ok(tags > 0, '整块应触发 onBlockTag');
  ba.query(4, { onQuery: () => queries++ });
  assert.equal(queries, 1);
});
