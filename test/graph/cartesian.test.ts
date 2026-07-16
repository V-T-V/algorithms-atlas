import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartesian } from '../../src/algorithms/graph/cartesian/impl.ts';

test('cartesian 根是全局最小值下标', () => {
  const A = [3, 1, 4, 1, 5, 9, 2, 6];
  const { root } = cartesian(A);
  // 最小值 1 首次出现在下标 1（首个最小值，因单调栈弹掉更前的更大值后 1 在底）
  assert.equal(root, 1);
  assert.equal(A[root], 1);
});

test('cartesian 堆性质：父 ≤ 子', () => {
  const A = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const { left, right } = cartesian(A);
  for (let i = 0; i < A.length; i++) {
    if (left[i] !== -1) assert.ok(A[i]! <= A[left[i]!]!, `left violation at ${i}`);
    if (right[i] !== -1) assert.ok(A[i]! <= A[right[i]!]!, `right violation at ${i}`);
  }
});

test('cartesian 中序遍历还原下标', () => {
  const A = [3, 1, 4, 1, 5, 9, 2, 6];
  const { root, left, right } = cartesian(A);
  const order: number[] = [];
  const dfs = (u: number): void => {
    if (u === -1) return;
    dfs(left[u]!);
    order.push(u);
    dfs(right[u]!);
  };
  dfs(root);
  assert.deepEqual(order, [0, 1, 2, 3, 4, 5, 6, 7]);
});

test('cartesian 单元素', () => {
  const { root, parent, left, right } = cartesian([42]);
  assert.equal(root, 0);
  assert.equal(parent[0], -1);
  assert.equal(left[0], -1);
  assert.equal(right[0], -1);
});

test('cartesian 严格递增 → 退化右链', () => {
  const A = [1, 2, 3, 4];
  const { root, left, right } = cartesian(A);
  assert.equal(root, 0);
  // 0 → right 1 → right 2 → right 3，全部无左子
  assert.equal(right[0], 1);
  assert.equal(right[1], 2);
  assert.equal(right[2], 3);
  for (let i = 0; i < A.length; i++) assert.equal(left[i], -1);
});

test('cartesian 钩子被调用', () => {
  const steps: number[] = [];
  let popCount = 0;
  let linkCount = 0;
  let rootReported = -1;
  cartesian([3, 1, 2], {
    onStep: (i) => steps.push(i),
    onPop: () => {
      popCount++;
    },
    onLink: () => {
      linkCount++;
    },
    onRoot: (r) => {
      rootReported = r;
    },
  });
  assert.deepEqual(steps, [0, 1, 2]);
  // 处理 1 时弹出 0（3>1）→ 1 次弹；建 1 条 link；处理 2 连右子 1 条 link
  assert.ok(popCount >= 1);
  assert.ok(linkCount >= 1);
  assert.equal(rootReported, 1);
});
