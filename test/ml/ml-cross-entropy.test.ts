import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crossEntropy } from '../../src/algorithms/ml/ml-cross-entropy/impl.ts';
test('交叉熵 完美预测≈0', () => {
  assert.ok(crossEntropy([1, 0], [1, 0]) < 1e-6);
});
test('交叉熵 长度不匹配', () => {
  assert.throws(() => crossEntropy([1], [1, 0]), RangeError);
});
