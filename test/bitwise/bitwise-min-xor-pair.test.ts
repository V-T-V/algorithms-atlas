import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minXorPair,
  minXorPairNaive,
} from '../../src/algorithms/bitwise/bitwise-min-xor-pair/impl.ts';

test('minXorPair 与朴素法一致', () => {
  for (const arr of [
    [9, 5, 3, 12, 1, 7],
    [0, 2, 5, 7],
    [1, 1, 1],
    [10, 20, 30, 40],
    [3, 1],
  ]) {
    assert.equal(minXorPair(arr).minXor, minXorPairNaive(arr).minXor, `[${arr.join(',')}]`);
  }
});

test('minXorPair 经典例子', () => {
  // 排序后 [1,3,5,7,9,12]，相邻异或：1^3=2, 3^5=6,... 最小 2
  assert.equal(minXorPair([9, 5, 3, 12, 1, 7]).minXor, 2);
  assert.deepEqual(minXorPair([3, 1]).pair, [1, 3]);
});

test('minXorPair 边界', () => {
  assert.equal(minXorPair([5]).pair, null);
  assert.deepEqual(minXorPair([5, 5]), { minXor: 0, pair: [5, 5] });
});

test('minXorPair 钩子触发相邻对比较', () => {
  let pairs = 0;
  minXorPair([3, 1, 2], { onPair: () => pairs++ });
  assert.equal(pairs, 2); // 排序后 [1,2,3] 两个相邻对
});
