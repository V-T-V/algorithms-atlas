import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ChairmanTree,
  chairmanTree,
  type ChairmanHooks,
} from '../../src/algorithms/tree/chairman-tree/impl.ts';

test('chairman-tree 区间第 k 小：经典数组', () => {
  // data = [5,2,8,1,9,3,7,4,6]，整体升序 [1,2,3,4,5,6,7,8,9]
  const data = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const tree = new ChairmanTree(data);
  // 整区间第 1 小 = 1，第 5 小 = 5，第 9 小 = 9
  assert.equal(tree.kth(1, 9, 1), 1);
  assert.equal(tree.kth(1, 9, 5), 5);
  assert.equal(tree.kth(1, 9, 9), 9);
});

test('chairman-tree 子区间第 k 小', () => {
  // data = [5,2,8,1,9,3,7,4,6]
  // 子区间 [2,5] = [2,8,1,9]，升序 [1,2,8,9]，第 2 小 = 2，第 3 小 = 8
  const data = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const tree = new ChairmanTree(data);
  assert.equal(tree.kth(2, 5, 2), 2);
  assert.equal(tree.kth(2, 5, 3), 8);
  assert.equal(tree.kth(2, 5, 4), 9);
});

test('chairman-tree 含重复元素', () => {
  // data = [3,1,2,3,3]，整体升序 [1,2,3,3,3]
  const data = [3, 1, 2, 3, 3];
  const tree = new ChairmanTree(data);
  assert.equal(tree.kth(1, 5, 1), 1);
  assert.equal(tree.kth(1, 5, 2), 2);
  assert.equal(tree.kth(1, 5, 3), 3);
  assert.equal(tree.kth(1, 5, 5), 3);
});

test('chairman-tree 越界返回 NaN', () => {
  const data = [1, 2, 3];
  const tree = new ChairmanTree(data);
  assert.ok(Number.isNaN(tree.kth(1, 3, 0)));
  assert.ok(Number.isNaN(tree.kth(1, 3, 4)));
  assert.ok(Number.isNaN(tree.kth(2, 1, 1)));
});

test('chairman-tree 便捷封装与 hooks', () => {
  const data = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const versions: Array<[number, number]> = [];
  const steps: Array<[number, number, boolean]> = [];
  const hooks: ChairmanHooks = {
    onVersion: (ver, val) => versions.push([ver, val]),
    onQueryStep: (lc, kk, goLeft) => steps.push([lc, kk, goLeft]),
  };
  const result = chairmanTree(
    data,
    [
      { ql: 1, qr: 9, k: 3 },
      { ql: 2, qr: 5, k: 2 },
    ],
    hooks,
  );
  assert.deepEqual(result, [3, 2]);
  // 9 个元素 → 9 个 onVersion
  assert.equal(versions.length, 9);
  assert.equal(versions[0]![1], 5); // 首个插入的是 a[1]=5
  // 查询时应有递归步
  assert.ok(steps.length > 0);
});

test('chairman-tree 与朴素排序对比一致', () => {
  const data = [7, 7, 1, 9, 2, 5, 4, 8, 3, 6];
  const tree = new ChairmanTree(data);
  for (let l = 1; l <= data.length; l++) {
    for (let r = l; r <= data.length; r++) {
      const sorted = data.slice(l - 1, r).sort((a, b) => a - b);
      for (let k = 1; k <= sorted.length; k++) {
        assert.equal(tree.kth(l, r, k), sorted[k - 1], `kth(${l},${r},${k})`);
      }
    }
  }
});
