import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LiChao3 } from '../../src/algorithms/ds/ds-li-chao-3/impl.ts';

test('li-chao 两直线取最大', () => {
  const lc = new LiChao3(10);
  lc.insert(0, 10, 1, 0); // y = x
  lc.insert(0, 10, -1, 10); // y = -x + 10
  assert.equal(lc.query(0), 10);
  assert.equal(lc.query(5), 5);
  assert.equal(lc.query(10), 10);
});

test('li-chao 水平线', () => {
  const lc = new LiChao3(10);
  lc.insert(0, 10, 0, 6);
  lc.insert(0, 10, 1, 0);
  assert.equal(lc.query(0), 6);
  assert.equal(lc.query(7), 7);
});
