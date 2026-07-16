import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findDuplicate2,
  type Dup2Hooks,
} from '../../src/algorithms/searching/search-duplicate-2/impl.ts';

test('findDuplicate2 基本', () => {
  assert.equal(findDuplicate2([1, 3, 4, 2, 2]), 2);
  assert.equal(findDuplicate2([3, 1, 3, 4, 2]), 3);
  assert.equal(findDuplicate2([1, 1]), 1);
  assert.equal(findDuplicate2([1, 1, 2]), 1);
});
test('findDuplicate2 钩子', () => {
  let c = 0;
  findDuplicate2([1, 3, 4, 2, 2], { onStep: () => c++ } as Dup2Hooks);
  assert.ok(c >= 1);
});
