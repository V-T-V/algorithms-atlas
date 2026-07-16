import { test } from 'node:test';
import assert from 'node:assert/strict';
import { svm } from '../../src/algorithms/ml/svm/impl.ts';

test('svm 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof svm === 'function');
});
