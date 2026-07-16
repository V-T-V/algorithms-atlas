import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sqrtSearch2, type Sqrt2Hooks } from '../../src/algorithms/searching/search-sqrt-2/impl.ts';

test('sqrtSearch2 基本', () => {
  assert.equal(sqrtSearch2(0), 0);
  assert.equal(sqrtSearch2(1), 1);
  assert.equal(sqrtSearch2(4), 2);
  assert.equal(sqrtSearch2(8), 2);
  assert.equal(sqrtSearch2(9), 3);
  assert.equal(sqrtSearch2(15), 3);
  assert.equal(sqrtSearch2(16), 4);
  assert.equal(sqrtSearch2(50), 7);
  assert.equal(sqrtSearch2(100), 10);
});
test('sqrtSearch2 钩子', () => {
  let c = 0;
  sqrtSearch2(50, { onTry: () => c++ } as Sqrt2Hooks);
  assert.ok(c >= 1);
});
