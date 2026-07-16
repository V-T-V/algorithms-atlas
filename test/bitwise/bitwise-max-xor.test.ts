import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findMaximumXOR,
  findMaximumXORNaive,
} from '../../src/algorithms/bitwise/bitwise-max-xor/impl.ts';

test('findMaximumXOR 与朴素法一致', () => {
  for (const arr of [[3, 10, 5, 25, 2, 8], [0], [1, 2, 4], [14, 70, 53, 83, 49, 91, 36, 80]]) {
    assert.equal(findMaximumXOR(arr), findMaximumXORNaive(arr), `[${arr.join(',')}]`);
  }
});

test('findMaximumXOR 经典例子', () => {
  assert.equal(findMaximumXOR([3, 10, 5, 25, 2, 8]), 28); // 5 ^ 25
  assert.equal(findMaximumXOR([14, 70, 53, 83, 49, 91, 36, 80]), 127);
  assert.equal(findMaximumXOR([1, 2, 4]), 6); // 2 ^ 4
});

test('findMaximumXOR 边界', () => {
  assert.equal(findMaximumXOR([]), 0);
  assert.equal(findMaximumXOR([5]), 0);
  assert.equal(findMaximumXOR([5, 5]), 0);
});

test('findMaximumXOR 钩子逐位触发', () => {
  let bits = 0;
  findMaximumXOR([3, 10, 5, 25, 2, 8], { onBit: () => bits++ });
  assert.ok(bits >= 1);
});
