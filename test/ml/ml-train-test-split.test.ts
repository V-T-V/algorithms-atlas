import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trainTestSplit } from '../../src/algorithms/ml/ml-train-test-split/impl.ts';
test('划分 总数守恒', () => {
  const { train, test } = trainTestSplit([1, 2, 3, 4, 5], 0.4, 1);
  assert.equal(train.length + test.length, 5);
});
test('划分 可复现', () => {
  assert.deepEqual(trainTestSplit([1, 2, 3], 0.3, 9), trainTestSplit([1, 2, 3], 0.3, 9));
});
