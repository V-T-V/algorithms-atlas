import { test } from 'node:test';
import assert from 'node:assert/strict';
import { singleElem } from '../../src/algorithms/searching/single-elem/impl.ts';

test('singleElem 基本', () => {
  assert.equal(singleElem([1, 1, 2, 3, 3, 4, 4, 8, 8]), 2);
  assert.equal(singleElem([3, 3, 7, 7, 10, 11, 11]), 4);
  assert.equal(singleElem([1, 1, 2]), 2);
  assert.equal(singleElem([1, 2, 2]), 0);
  assert.equal(singleElem([1]), 0);
});

test('singleElem 边界', () => {
  assert.equal(singleElem([]), -1);
  assert.equal(singleElem([5]), 0);
});

test('singleElem 钩子', () => {
  let done = -1;
  singleElem([1, 1, 2, 3, 3, 4, 4, 8, 8], { onDone: (i) => (done = i) });
  assert.equal(done, 2);
});
