import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SqrtDecomposition } from '../../src/algorithms/design/sqrt-decomposition-design/impl.ts';

test('SqrtDecomposition 区间求和（全段）', () => {
  const sd = new SqrtDecomposition([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(sd.rangeSum(0, 9), 55);
});

test('SqrtDecomposition 区间求和（部分）', () => {
  const sd = new SqrtDecomposition([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(sd.rangeSum(2, 5), 18);
  assert.equal(sd.rangeSum(0, 0), 1);
  assert.equal(sd.rangeSum(9, 9), 10);
});

test('SqrtDecomposition 与朴素法一致（随机）', () => {
  const arr = Array.from({ length: 50 }, (_, i) => (i * 7) % 13);
  const sd = new SqrtDecomposition(arr);
  const naive = (l: number, r: number): number => {
    let s = 0;
    for (let i = l; i <= r; i++) s += arr[i]!;
    return s;
  };
  for (let l = 0; l < 50; l++) {
    for (let r = l; r < 50; r++) {
      assert.equal(sd.rangeSum(l, r), naive(l, r), `l=${l} r=${r}`);
    }
  }
});

test('SqrtDecomposition 单点更新后求和正确', () => {
  const sd = new SqrtDecomposition([1, 2, 3, 4, 5]);
  sd.update(2, 30);
  assert.equal(sd.rangeSum(0, 4), 42);
  assert.equal(sd.rangeSum(2, 2), 30);
});

test('SqrtDecomposition 不影响原数组（拷贝）', () => {
  const input = [1, 2, 3];
  const sd = new SqrtDecomposition(input);
  sd.update(0, 100);
  assert.deepEqual(input, [1, 2, 3]); // 原数组未变
  assert.equal(sd.snapshot()[0], 100);
});

test('SqrtDecomposition 单元素', () => {
  const sd = new SqrtDecomposition([42]);
  assert.equal(sd.rangeSum(0, 0), 42);
  sd.update(0, 7);
  assert.equal(sd.rangeSum(0, 0), 7);
});

test('SqrtDecomposition 非法范围抛错', () => {
  const sd = new SqrtDecomposition([1, 2, 3]);
  assert.throws(() => sd.rangeSum(-1, 2));
  assert.throws(() => sd.rangeSum(0, 3));
  assert.throws(() => sd.update(5, 0));
});
