import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matMul } from '../../src/algorithms/numerical/num-matrix-mult/impl.ts';
test('矩阵乘', () => {
  assert.deepEqual(matMul([[1, 2]], [[3], [4]]), [[11]]);
});
test('维度不匹配', () => {
  assert.throws(() => matMul([[1, 2]], [[1, 2]]), RangeError);
});
