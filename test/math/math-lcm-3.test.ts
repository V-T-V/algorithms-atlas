import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lcm, lcmMulti } from '../../src/algorithms/math/math-lcm-3/impl.ts';

test('lcm 二元', () => {
  assert.equal(lcm(4, 6), 12n);
  assert.equal(lcm(21, 6), 42n);
});

test('lcm 多元', () => {
  assert.equal(lcmMulti([4, 6, 8, 10]), 120n);
});

test('lcm 含 0', () => {
  assert.equal(lcm(0, 5), 0n);
});
