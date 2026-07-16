import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  radixSortLsdHex,
  type RadixHexHooks,
} from '../../src/algorithms/sorting/sort-radix-lsd-hex/impl.ts';

test('radixSortLsdHex 基本', () => {
  assert.deepEqual(radixSortLsdHex([]), []);
  assert.deepEqual(radixSortLsdHex([1]), [1]);
  assert.deepEqual(radixSortLsdHex([2, 1]), [1, 2]);
  assert.deepEqual(
    radixSortLsdHex([170, 45, 75, 90, 802, 24, 2, 66]),
    [2, 24, 45, 66, 75, 90, 170, 802],
  );
});
test('radixSortLsdHex 逆序/重复', () => {
  assert.deepEqual(radixSortLsdHex([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(radixSortLsdHex([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('radixSortLsdHex 不修改原数组', () => {
  const input = [3, 1, 2];
  radixSortLsdHex(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('radixSortLsdHex 钩子', () => {
  let c = 0;
  radixSortLsdHex([300, 1, 20], { onPass: () => c++ } as RadixHexHooks);
  assert.ok(c >= 1);
});
