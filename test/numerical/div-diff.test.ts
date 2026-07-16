import { test } from 'node:test';
import assert from 'node:assert/strict';
import { divDiff } from '../../src/algorithms/numerical/div-diff/impl.ts';

test('div-diff 基本行为（y=x²）', () => {
  // x=[0,1,2,3], y=[0,1,4,9]; 对角线应为 [0, 1, 1, 0]
  const coef = divDiff([0, 1, 2, 3], [0, 1, 4, 9]);
  assert.deepEqual(coef, [0, 1, 1, 0]);
});

test('div-diff 线性函数差商', () => {
  // y = 2x + 1, 任意节点 -> 对角线 [y0, 2, 0, 0...]
  const coef = divDiff([1, 3, 5, 7], [3, 7, 11, 15]);
  assert.deepEqual(coef, [3, 2, 0, 0]);
});

test('div-diff 三次函数三阶差商恒为 1', () => {
  // y = x³, x=[0,1,2,3] -> 对角线 [0, 1, 3, 1]
  // （n 次多项式的 n 阶差商 = n 阶导数 / n! = 6/6 = 1）
  const coef = divDiff([0, 1, 2, 3], [0, 1, 8, 27]);
  assert.deepEqual(coef, [0, 1, 3, 1]);
});

test('div-diff 单节点返回自身', () => {
  assert.deepEqual(divDiff([5], [42]), [42]);
});

test('div-diff 节点重复抛错', () => {
  assert.throws(() => divDiff([1, 1, 2], [1, 2, 3]));
});

test('div-diff 钩子被调用', () => {
  const cells: Array<[number, number]> = [];
  divDiff([0, 1, 2], [0, 1, 4], {
    onCell: (i, k) => cells.push([i, k]),
  });
  // 0 阶 3 个 + 1 阶 2 个 + 2 阶 1 个 = 6
  assert.equal(cells.length, 6);
});
