import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMultilevel,
  flattenMultilevel,
  multiListToArray,
} from '../../src/algorithms/list/list-flatten-multilevel/impl.ts';

test('flattenMultilevel 扁平化', () => {
  const head = buildMultilevel([1, 2, 3, 4, 5, 6, 7, 8], { 2: 5 });
  flattenMultilevel(head);
  assert.deepEqual(multiListToArray(head), [1, 2, 3, 6, 7, 8, 4, 5]);
});

test('flattenMultilevel 无 child', () => {
  const head = buildMultilevel([1, 2, 3], {});
  flattenMultilevel(head);
  assert.deepEqual(multiListToArray(head), [1, 2, 3]);
});

test('flattenMultilevel 空链表', () => {
  assert.equal(flattenMultilevel(buildMultilevel([], {})), null);
});

test('flattenMultilevel 钩子', () => {
  let splices = 0;
  const head = buildMultilevel([1, 2, 3], { 1: 2 });
  flattenMultilevel(head, { onSplice: () => splices++ });
  assert.equal(splices, 1);
});
