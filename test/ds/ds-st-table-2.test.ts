import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SparseTable2 } from '../../src/algorithms/ds/ds-st-table-2/impl.ts';

test('st 表区间最大', () => {
  const st = new SparseTable2([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(st.query(0, 7), 9);
  assert.equal(st.query(0, 3), 4);
  assert.equal(st.query(2, 6), 9);
  assert.equal(st.query(1, 1), 1);
});
