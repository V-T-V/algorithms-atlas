import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editDistance } from '../../src/algorithms/dp/dp-edit-4/impl.ts';

test('edit horse/ros', () => {
  assert.equal(editDistance('horse', 'ros'), 3);
});
test('edit 相同', () => {
  assert.equal(editDistance('abc', 'abc'), 0);
});
test('edit 空', () => {
  assert.equal(editDistance('', 'abc'), 3);
});
test('edit intention/execution', () => {
  assert.equal(editDistance('intention', 'execution'), 5);
});
