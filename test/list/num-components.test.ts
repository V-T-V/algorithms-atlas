import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, numComponents } from '../../src/algorithms/list/num-components/impl.ts';

test('numComponents 计数', () => {
  assert.equal(numComponents(buildList([0, 1, 2, 3]), [0, 1, 3]), 2); // [0,1] 一段，[3] 一段
  assert.equal(numComponents(buildList([0, 1, 2, 3, 4]), [0, 3, 1, 4]), 2); // [0,1] 与 [3,4]
  assert.equal(numComponents(buildList([0, 1, 2, 3]), []), 0);
  assert.equal(numComponents(buildList([1, 2, 3]), [1, 2, 3]), 1);
});

test('numComponents 钩子', () => {
  let components = 0;
  numComponents(buildList([0, 1, 2, 3]), [0, 1, 3], {
    onComponent: () => components++,
  });
  assert.equal(components, 2);
});
