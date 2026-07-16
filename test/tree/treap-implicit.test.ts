import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildImplicit,
  implicitInsert,
  implicitDelete,
  implicitReverse,
  implicitAt,
  toArray,
  resetSeed,
} from '../../src/algorithms/tree/treap-implicit/impl.ts';

test('implicit treap 构建后序列正确', () => {
  resetSeed(20240601);
  const root = buildImplicit([1, 2, 3, 4, 5]);
  assert.deepEqual(toArray(root), [1, 2, 3, 4, 5]);
});

test('implicitInsert 在指定位置插入', () => {
  resetSeed(20240601);
  let root = buildImplicit([1, 3, 4]);
  root = implicitInsert(root, 1, 2); // 插到位置 1
  assert.deepEqual(toArray(root), [1, 2, 3, 4]);
  root = implicitInsert(root, 0, 0); // 插到队首
  assert.deepEqual(toArray(root), [0, 1, 2, 3, 4]);
  root = implicitInsert(root, 5, 5); // 插到队尾
  assert.deepEqual(toArray(root), [0, 1, 2, 3, 4, 5]);
});

test('implicitDelete 删除指定位置', () => {
  resetSeed(20240601);
  let root = buildImplicit([1, 2, 3, 4, 5]);
  root = implicitDelete(root, 0); // 删队首
  assert.deepEqual(toArray(root), [2, 3, 4, 5]);
  root = implicitDelete(root, 3); // 删队尾
  assert.deepEqual(toArray(root), [2, 3, 4]);
});

test('implicitReverse 区间反转', () => {
  resetSeed(20240601);
  let root = buildImplicit([1, 2, 3, 4, 5, 6, 7]);
  root = implicitReverse(root, 1, 5); // 反转 [1,5]
  assert.deepEqual(toArray(root), [1, 6, 5, 4, 3, 2, 7]);
  root = implicitReverse(root, 0, 6); // 整体反转
  assert.deepEqual(toArray(root), [7, 2, 3, 4, 5, 6, 1]);
});

test('implicitAt 取指定位置', () => {
  resetSeed(20240601);
  const root = buildImplicit([10, 20, 30, 40, 50]);
  assert.equal(implicitAt(root, 0), 10);
  assert.equal(implicitAt(root, 4), 50);
  assert.equal(implicitAt(root, 2), 30);
  assert.equal(implicitAt(root, 100), null);
});

test('implicit treap 钩子被调用', () => {
  resetSeed(20240601);
  let splits = 0;
  let merges = 0;
  buildImplicit([1, 2, 3], {
    onSplit: () => splits++,
    onMerge: () => merges++,
  });
  assert.ok(splits >= 1, '应至少 split 一次');
  assert.ok(merges >= 1, '应至少 merge 一次');
});

test('implicit treap 空序列', () => {
  resetSeed(20240601);
  assert.equal(buildImplicit([]), null);
  assert.deepEqual(toArray(null), []);
});
