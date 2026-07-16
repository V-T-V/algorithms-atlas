import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btCombine } from '../../src/algorithms/backtracking/bt-combine/impl.ts';

const norm = (xs: number[][]): string[] => xs.map((s) => s.join(',')).sort();

test('bt-combine C(4,2)', () => {
  assert.deepEqual(norm(btCombine(4, 2)), ['1,2', '1,3', '1,4', '2,3', '2,4', '3,4']);
});

test('bt-combine 数量等于组合数', () => {
  const C = (n: number, k: number): number => {
    let r = 1;
    for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
    return r;
  };
  assert.equal(btCombine(5, 3).length, C(5, 3));
  assert.equal(btCombine(6, 2).length, 15);
});

test('bt-combine k=0 仅空组合', () => {
  assert.deepEqual(btCombine(4, 0), [[]]);
});

test('bt-combine k>n 为空', () => {
  assert.deepEqual(btCombine(3, 5), []);
});
