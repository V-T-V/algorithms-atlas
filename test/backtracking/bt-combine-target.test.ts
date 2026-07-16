import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btCombineTarget } from '../../src/algorithms/backtracking/bt-combine-target/impl.ts';

const norm = (xs: number[][]): string[] =>
  xs.map((s) => [...s].sort((a, b) => a - b).join(',')).sort();

test('bt-combine-target [2,3,6,7] target=7', () => {
  assert.deepEqual(norm(btCombineTarget([2, 3, 6, 7], 7)), ['2,2,3', '7']);
});

test('bt-combine-target 所有组合和等于 target', () => {
  const res = btCombineTarget([2, 3, 5], 8);
  for (const c of res)
    assert.equal(
      c.reduce((a, b) => a + b, 0),
      8,
    );
  assert.ok(res.length > 0);
});

test('bt-combine-target target=0 仅空解', () => {
  assert.deepEqual(btCombineTarget([2, 3], 0), [[]]);
});

test('bt-combine-target 无解返回空', () => {
  assert.deepEqual(btCombineTarget([2, 4], 7), []);
});
