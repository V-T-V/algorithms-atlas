import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SegmentTree, segmentTree } from '../../src/algorithms/ds/segment-tree/impl.ts';

// 暴力求和，用于交叉验证
function bruteSum(arr: number[], ql: number, qr: number): number {
  let s = 0;
  for (let i = Math.max(0, ql); i <= Math.min(arr.length - 1, qr); i++) s += arr[i]!;
  return s;
}

test('segment-tree 建树与区间查询', () => {
  const arr = [2, 1, 5, 3, 4];
  const st = segmentTree(arr);
  assert.equal(st.query(0, 4), 15);
  assert.equal(st.query(0, 0), 2);
  assert.equal(st.query(4, 4), 4);
  assert.equal(st.query(1, 3), 9);
  assert.equal(st.query(2, 2), 5);
});

test('segment-tree 查询与暴力一致（随机）', () => {
  const arr = [3, 7, 1, 8, 2, 9, 4, 6, 5];
  const st = segmentTree(arr);
  for (let ql = 0; ql < arr.length; ql++) {
    for (let qr = ql; qr < arr.length; qr++) {
      assert.equal(st.query(ql, qr), bruteSum(arr, ql, qr), `mismatch [${ql},${qr}]`);
    }
  }
});

test('segment-tree 单点更新', () => {
  const st = segmentTree([2, 1, 5, 3, 4]);
  assert.equal(st.query(0, 4), 15);
  st.update(2, 8); // 5 -> 8
  assert.equal(st.query(0, 4), 18);
  assert.equal(st.query(2, 2), 8);
  assert.equal(st.query(1, 3), 1 + 8 + 3);
  st.update(0, 10); // 2 -> 10
  assert.equal(st.query(0, 4), 26);
});

test('segment-tree 边界：空数组', () => {
  const st = segmentTree([]);
  assert.equal(st.query(0, 0), 0);
  assert.equal(st.query(-1, 5), 0);
  // update 越界应被忽略
  st.update(0, 100);
  assert.deepEqual(st.toArray(), []);
});

test('segment-tree 边界：单元素', () => {
  const st = segmentTree([42]);
  assert.equal(st.query(0, 0), 42);
  st.update(0, 7);
  assert.equal(st.query(0, 0), 7);
});

test('segment-tree 越界查询自动忽略', () => {
  const st = segmentTree([1, 2, 3]);
  assert.equal(st.query(-5, 0), 1); // 仅下标 0
  assert.equal(st.query(2, 100), 3); // 仅下标 2
  assert.equal(st.query(-5, 100), 6); // 全部
  assert.equal(st.query(10, 20), 0); // 完全越界
});

test('segment-tree 连续更新后仍正确', () => {
  const arr = [1, 2, 3, 4, 5];
  const st = segmentTree(arr);
  for (let i = 0; i < arr.length; i++) {
    st.update(i, arr[i]! * 2);
  }
  for (let ql = 0; ql < arr.length; ql++) {
    for (let qr = ql; qr < arr.length; qr++) {
      assert.equal(
        st.query(ql, qr),
        bruteSum(
          arr.map((v) => v * 2),
          ql,
          qr,
        ),
      );
    }
  }
});

test('segment-tree 钩子被调用', () => {
  let builds = 0;
  let visits = 0;
  let updates = 0;
  const st = new SegmentTree();
  st.build([1, 2, 3, 4], {
    onBuildNode: () => builds++,
  });
  st.query(0, 3, { onQueryVisit: () => visits++ });
  st.update(0, 10, { onUpdateNode: () => updates++ });
  // 4 个叶子 + 3 个内部 = 7 个节点
  assert.equal(builds, 7);
  assert.ok(visits > 0, '查询应触发访问回调');
  assert.ok(updates > 0, '更新应触发节点刷新');
});

test('segment-tree 查询完全覆盖剪枝', () => {
  let fullCount = 0;
  const st = segmentTree([1, 2, 3, 4]);
  // 全区间查询：根节点应被完全覆盖，只需访问 1 个节点
  st.query(0, 3, {
    onQueryVisit: (_n, _lo, _hi, fully) => {
      if (fully) fullCount++;
    },
  });
  assert.equal(fullCount, 1, '完全覆盖应只命中根节点');
});
