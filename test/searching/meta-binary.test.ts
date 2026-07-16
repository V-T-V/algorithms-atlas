import { test } from 'node:test';
import assert from 'node:assert/strict';
import { metaBinary } from '../../src/algorithms/searching/meta-binary/impl.ts';

test('metaBinary 命中与未命中', () => {
  const a = [1, 3, 5, 7, 9, 11, 13, 15, 17];
  assert.equal(metaBinary(a, 7), 3);
  assert.equal(metaBinary(a, 1), 0);
  assert.equal(metaBinary(a, 17), 8);
  assert.equal(metaBinary(a, 6), -1);
  assert.equal(metaBinary(a, 0), -1);
  assert.equal(metaBinary(a, 99), -1);
});

test('metaBinary 边界', () => {
  assert.equal(metaBinary([], 1), -1);
  assert.equal(metaBinary([5], 5), 0);
  assert.equal(metaBinary([5], 3), -1);
});

test('metaBinary 钩子', () => {
  let decides = 0;
  let done = -1;
  metaBinary([1, 3, 5, 7, 9, 11, 13, 15], 11, {
    onDecide: () => decides++,
    onDone: (i) => (done = i),
  });
  assert.ok(decides > 0);
  assert.equal(done, 5);
});
