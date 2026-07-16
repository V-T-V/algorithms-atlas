import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  missingNumberXor,
  missingNumberSum,
} from '../../src/algorithms/searching/search-missing-number/impl.ts';

test('missingNumberXor 找缺失', () => {
  assert.equal(missingNumberXor([3, 0, 1]), 2);
  assert.equal(missingNumberXor([0, 1]), 2);
  assert.equal(missingNumberXor([9, 6, 4, 2, 3, 5, 7, 0, 1]), 8);
  assert.equal(missingNumberXor([0]), 1);
  assert.equal(missingNumberXor([1]), 0);
});

test('missingNumberSum 找缺失', () => {
  assert.equal(missingNumberSum([3, 0, 1]), 2);
  assert.equal(missingNumberSum([9, 6, 4, 2, 3, 5, 7, 0, 1]), 8);
  assert.equal(missingNumberSum([0]), 1);
  assert.equal(missingNumberSum([1]), 0);
});

test('两种方法结果一致（随机）', () => {
  for (const n of [1, 2, 5, 10, 50]) {
    for (let miss = 0; miss <= n; miss++) {
      const arr: number[] = [];
      for (let v = 0; v <= n; v++) if (v !== miss) arr.push(v);
      // 打乱
      arr.sort(() => Math.random() - 0.5);
      assert.equal(missingNumberXor(arr), miss);
      assert.equal(missingNumberSum(arr), miss);
    }
  }
});

test('钩子触发逐步累异或', () => {
  let steps = 0;
  missingNumberXor([3, 0, 1], { onXorStep: () => steps++ });
  assert.equal(steps, 3);
});
