import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SparseTable, sparseTable } from '../../src/algorithms/design/sparse-table/impl.ts';

test('sparse-table 第 0 层等于原数组', () => {
  const st = new SparseTable([5, 2, 8, 1, 9]);
  assert.deepEqual(st.st[0], [5, 2, 8, 1, 9]);
});

test('sparse-table 区间最小值正确', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0];
  const st = new SparseTable(arr);
  // 朴素对照
  const naive = (l: number, r: number): number => Math.min(...arr.slice(l, r + 1));
  for (let l = 0; l < arr.length; l++) {
    for (let r = l; r < arr.length; r++) {
      assert.equal(st.query(l, r), naive(l, r), `[${l},${r}] 不一致`);
    }
  }
});

test('sparse-table 单元素区间', () => {
  const st = new SparseTable([3, 1, 4, 1, 5]);
  assert.equal(st.query(0, 0), 3);
  assert.equal(st.query(2, 2), 4);
});

test('sparse-table 全区间最小值', () => {
  const st = new SparseTable([5, 2, 8, 1, 9]);
  assert.equal(st.query(0, 4), 1);
});

test('sparse-table 非法区间抛错', () => {
  const st = new SparseTable([1, 2, 3]);
  assert.throws(() => st.query(-1, 2), RangeError);
  assert.throws(() => st.query(0, 3), RangeError);
  assert.throws(() => st.query(2, 1), RangeError);
});

test('sparse-table 空数组', () => {
  const st = new SparseTable([]);
  assert.equal(st.n, 0);
  assert.equal(st.st.length, 0);
});

test('sparse-table 钩子 onBuild 逐层触发', () => {
  const levels: Array<[number, number[]]> = [];
  new SparseTable([5, 2, 8, 1], {
    onBuild: (k, lv) => levels.push([k, [...lv]]),
  });
  // n=4 → log2(4)=2 → K=3 层（0,1,2）；每层仅含有效条目（长度 n-2^k+1）
  assert.equal(levels.length, 3);
  assert.deepEqual(levels[0], [0, [5, 2, 8, 1]]);
  // 第 1 层：相邻两两 min（有效长度 3）
  assert.deepEqual(levels[1], [1, [2, 2, 1]]);
  // 第 2 层：长度 4 区间 min（有效长度 1）
  assert.deepEqual(levels[2], [2, [1]]);
});

test('sparse-table 便捷函数', () => {
  assert.equal(sparseTable([9, 8, 7, 6, 5], 1, 3), 6);
});

test('sparse-table 2 的幂长度边界', () => {
  const arr = [4, 2, 6, 8, 1, 3, 5, 7]; // 长度 8
  const st = new SparseTable(arr);
  assert.equal(st.query(0, 7), 1);
  assert.equal(st.query(0, 3), 2);
  assert.equal(st.query(4, 7), 1);
});
