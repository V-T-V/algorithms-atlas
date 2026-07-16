import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mooreVoting } from '../../src/algorithms/design/moore-voting/impl.ts';

test('mooreVoting 存在多数', () => {
  assert.equal(mooreVoting([2, 2, 1, 1, 1, 2, 2]).majority, 2);
  assert.equal(mooreVoting([3, 3, 4]).majority, 3);
  assert.equal(mooreVoting([1, 1, 1, 2, 3]).majority, 1);
});

test('mooreVoting 全相同', () => {
  assert.equal(mooreVoting([7, 7, 7, 7]).majority, 7);
});

test('mooreVoting 单元素', () => {
  assert.equal(mooreVoting([42]).majority, 42);
});

test('mooreVoting 无多数（验证生效）', () => {
  assert.equal(mooreVoting([1, 2, 3]).majority, null);
  assert.equal(mooreVoting([1, 1, 2, 2]).majority, null);
});

test('mooreVoting 关闭验证（假定存在多数）', () => {
  // [1,2,3] 无多数，但关闭验证会给出一个候选
  const r = mooreVoting([1, 2, 3], {}, false);
  assert.equal(r.majority, r.candidate);
});

test('mooreVoting 不修改原数组', () => {
  const input = [1, 1, 2];
  mooreVoting(input);
  assert.deepEqual(input, [1, 1, 2]);
});

test('mooreVoting 空数组', () => {
  assert.equal(mooreVoting([]).majority, null);
});
