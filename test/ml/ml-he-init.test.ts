import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heInit } from '../../src/algorithms/ml/ml-he-init/impl.ts';
test('He 初始化 数量', () => {
  assert.equal(heInit(5, 10, 1).length, 10);
});
test('He 初始化 可复现', () => {
  assert.deepEqual(heInit(5, 3, 1), heInit(5, 3, 1));
});
