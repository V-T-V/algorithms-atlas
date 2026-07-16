import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SparseTable, disjoint } from '../../src/algorithms/ds/disjoint/impl.ts';

test('sparse-table 区间最小查询', () => {
  const st = new SparseTable([5, 2, 8, 1, 9, 3, 7, 4, 6]);
  assert.equal(st.query(0, 8), 1);
  assert.equal(st.query(0, 2), 2);
  assert.equal(st.query(3, 5), 1);
  assert.equal(st.query(4, 4), 9); // 单点
  assert.equal(st.query(6, 8), 4);
});

test('sparse-table 查询返回下标', () => {
  const st = new SparseTable([5, 2, 8, 1, 9, 3, 7, 4, 6]);
  assert.equal(st.queryIndex(0, 8), 3); // 值 1 在下标 3
  assert.equal(st.queryIndex(4, 4), 4);
  assert.equal(st.queryIndex(0, 1), 1); // 2 在下标 1
});

test('sparse-table 全相同 / 递增 / 递减', () => {
  const eq = new SparseTable([7, 7, 7, 7]);
  assert.equal(eq.query(0, 3), 7);
  assert.equal(eq.queryIndex(1, 2), 1); // 相等取左侧
  const inc = new SparseTable([1, 2, 3, 4, 5]);
  assert.equal(inc.query(0, 4), 1);
  assert.equal(inc.query(2, 4), 3);
  const dec = new SparseTable([5, 4, 3, 2, 1]);
  assert.equal(dec.query(0, 4), 1);
  assert.equal(dec.query(0, 2), 3);
});

test('sparse-table 边界与越界', () => {
  const st = new SparseTable([3, 1, 2]);
  assert.equal(st.query(0, 0), 3);
  assert.equal(st.query(2, 2), 2);
  assert.ok(Number.isNaN(st.query(0, 5))); // 越界
  assert.equal(st.queryIndex(2, 1), -1); // 空
});

test('disjoint 便利函数批量查询', () => {
  const out = disjoint({
    values: [5, 2, 8, 1, 9, 3, 7, 4, 6],
    queries: [
      [0, 8],
      [2, 6],
      [4, 4],
    ],
  });
  assert.deepEqual(out, [1, 1, 9]);
});

test('sparse-table 钩子被调用', () => {
  let fills = 0;
  let compares = 0;
  let results = 0;
  let logReady = 0;
  const st = new SparseTable([5, 2, 8, 1, 9, 3, 7], {
    onFill: () => fills++,
    onLogReady: () => logReady++,
  });
  assert.ok(fills >= 7, '建表应填充若干格');
  assert.equal(logReady, 1);
  st.query(1, 5, {
    onQueryCompare: () => compares++,
    onResult: () => results++,
  });
  assert.ok(compares >= 1, '查询应比较');
  assert.equal(results, 1);
});
