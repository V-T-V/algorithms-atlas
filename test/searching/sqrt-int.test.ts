import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sqrtInt } from '../../src/algorithms/searching/sqrt-int/impl.ts';

test('sqrtInt 基本', () => {
  assert.equal(sqrtInt(0), 0);
  assert.equal(sqrtInt(1), 1);
  assert.equal(sqrtInt(4), 2);
  assert.equal(sqrtInt(8), 2);
  assert.equal(sqrtInt(9), 3);
  assert.equal(sqrtInt(15), 3);
  assert.equal(sqrtInt(16), 4);
  assert.equal(sqrtInt(100), 10);
  assert.equal(sqrtInt(99), 9);
});

test('sqrtInt 非法', () => {
  assert.ok(Number.isNaN(sqrtInt(-1)));
  assert.ok(Number.isNaN(sqrtInt(2.5)));
});

test('sqrtInt 钩子', () => {
  let probes = 0;
  let done = -1;
  sqrtInt(8, {
    onProbe: () => probes++,
    onDone: (r) => (done = r),
  });
  assert.ok(probes > 0);
  assert.equal(done, 2);
});
