import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSymmetric, buildTree } from '../../src/algorithms/tree/tree-is-symmetric/impl.ts';

test('isSymmetric 对称', () => {
  assert.equal(isSymmetric(buildTree([1, 2, 2, 3, 4, 4, 3])), true);
  // 1 / 2 2 \ 3(null,3) vs 3(3,null) 镜像对称
  assert.equal(isSymmetric(buildTree([1, 2, 2, null, 3, 3, null])), true);
});

test('isSymmetric 不对称', () => {
  assert.equal(isSymmetric(buildTree([1, 2, 2, null, 3, null, 3])), false);
  assert.equal(isSymmetric(buildTree([1, 2, 3])), false);
});

test('isSymmetric 边界', () => {
  assert.equal(isSymmetric(null), true);
  assert.equal(isSymmetric(buildTree([1])), true);
  assert.equal(isSymmetric(buildTree([1, 2, 2])), true);
});

test('isSymmetric 钩子触发比较', () => {
  let compares = 0;
  isSymmetric(buildTree([1, 2, 2, 3, 4, 4, 3]), { onCompare: () => compares++ });
  assert.ok(compares >= 3);
});
