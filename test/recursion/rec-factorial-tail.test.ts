import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  factorialTail,
  factorialNaive,
  factorialIter,
} from '../../src/algorithms/recursion/rec-factorial-tail/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-factorial-tail/trace.ts';

test('rec-factorial-tail 基本值', () => {
  assert.equal(factorialTail(0), 1n);
  assert.equal(factorialTail(1), 1n);
  assert.equal(factorialTail(5), 120n);
  assert.equal(factorialTail(10), 3628800n);
});

test('rec-factorial-tail 三版本一致', () => {
  for (const n of [0, 1, 5, 15, 25]) {
    assert.equal(factorialTail(n), factorialNaive(n));
    assert.equal(factorialTail(n), factorialIter(n));
  }
});

test('rec-factorial-tail 支持大数', () => {
  // 20! = 2432902008176640000
  assert.equal(factorialTail(20), 2432902008176640000n);
});

test('rec-factorial-tail trace', () => {
  assert.ok(buildTrace().length > 2);
});
