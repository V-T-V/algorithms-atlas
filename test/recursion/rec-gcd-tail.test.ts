import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gcdTail,
  gcdSubtract,
  gcdIter,
  lcm,
} from '../../src/algorithms/recursion/rec-gcd-tail/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-gcd-tail/trace.ts';

test('rec-gcd-tail 基本值', () => {
  assert.equal(gcdTail(12, 8), 4);
  assert.equal(gcdTail(252, 105), 21);
  assert.equal(gcdTail(17, 5), 1);
  assert.equal(gcdTail(100, 0), 100);
});

test('rec-gcd-tail 三版本一致', () => {
  for (const [a, b] of [
    [12, 8],
    [252, 105],
    [17, 5],
    [48, 36],
  ] as const) {
    assert.equal(gcdTail(a, b), gcdSubtract(a, b));
    assert.equal(gcdTail(a, b), gcdIter(a, b));
  }
});

test('rec-gcd-tail lcm 正确', () => {
  assert.equal(lcm(4, 6), 12);
  assert.equal(lcm(21, 6), 42);
});

test('rec-gcd-tail trace', () => {
  assert.ok(buildTrace().length > 2);
});
