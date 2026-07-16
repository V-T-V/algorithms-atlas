import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goldbachVerify } from '../../src/algorithms/math/math-goldbach-verify/impl.ts';

test('goldbach N=20 全成立', () => {
  const { valid, representations } = goldbachVerify(20);
  assert.equal(valid, true);
  assert.equal(representations.length, 9); // 4,6,8,...,20
});

test('goldbach 4 = 2+2', () => {
  const { representations } = goldbachVerify(4);
  assert.deepEqual(representations[0]!.repr, [2, 2]);
});

test('goldbach N=2 无验证', () => {
  const { representations } = goldbachVerify(2);
  assert.equal(representations.length, 0);
});

test('goldbach 10 = 3+7', () => {
  const { representations } = goldbachVerify(10);
  const ten = representations.find((r) => r.even === 10);
  assert.deepEqual(ten?.repr, [3, 7]);
});
