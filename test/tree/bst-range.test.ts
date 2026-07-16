import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bstRange, bstInsert, type RangeHooks } from '../../src/algorithms/tree/bst-range/impl.ts';

test('bst-range 空树返回空数组', () => {
  assert.deepEqual(bstRange(null, 0, 100), []);
});

test('bst-range 单节点命中', () => {
  const root = bstInsert([5]);
  assert.deepEqual(bstRange(root, 0, 100), [5]);
  assert.deepEqual(bstRange(root, 10, 20), []);
});

test('bst-range 经典 BST 区间 [35,65] 返回升序子集', () => {
  // 树形：       50
  //           /     \
  //          30      70
  //         /  \    /  \
  //        20  40  60  80
  const root = bstInsert([50, 30, 70, 20, 40, 60, 80]);
  assert.deepEqual(bstRange(root, 35, 65), [40, 50, 60]);
  assert.deepEqual(bstRange(root, 25, 55), [30, 40, 50]);
  assert.deepEqual(bstRange(root, 0, 100), [20, 30, 40, 50, 60, 70, 80]);
});

test('bst-range 剪枝正确：极窄区间只命中根', () => {
  const root = bstInsert([50, 30, 70, 20, 40, 60, 80]);
  assert.deepEqual(bstRange(root, 50, 50), [50]);
});

test('bst-range hooks 被正确触发', () => {
  const root = bstInsert([50, 30, 70, 20, 40, 60, 80]);
  const visits: Array<[number, boolean]> = [];
  const prunes: Array<[number, 'left' | 'right']> = [];
  const hooks: RangeHooks = {
    onVisit: (v, ir) => visits.push([v, ir]),
    onPrune: (v, side) => prunes.push([v, side]),
  };
  const result = bstRange(root, 35, 65, hooks);
  assert.deepEqual(result, [40, 50, 60]);

  const inRange = visits.filter(([, ir]) => ir).map(([v]) => v);
  assert.deepEqual(inRange, [40, 50, 60]);

  assert.ok(prunes.length > 0, '应当至少发生一次剪枝');
  // 30 < 35 → 剪掉 30 的左子树（含 20，全部 < 35）
  assert.ok(
    prunes.some(([v, s]) => v === 30 && s === 'left'),
    '应剪掉 30 的左子树',
  );
  // 70 > 65 → 剪掉 70 的右子树（含 80，全部 > 65）
  assert.ok(
    prunes.some(([v, s]) => v === 70 && s === 'right'),
    '应剪掉 70 的右子树',
  );
});
