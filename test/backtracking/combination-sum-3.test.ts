import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationSum3 } from '../../src/algorithms/backtracking/combination-sum-3/impl.ts';

const asStrs = (xs: number[][]): string[] => xs.map((c) => c.join(',')).sort();

test('combination-sum-3 k=3 n=7', () => {
  // 唯一解：1+2+4
  assert.deepEqual(asStrs(combinationSum3(3, 7)), ['1,2,4']);
});

test('combination-sum-3 k=3 n=9', () => {
  // 1+2+6, 1+3+5, 2+3+4
  assert.deepEqual(asStrs(combinationSum3(3, 9)), ['1,2,6', '1,3,5', '2,3,4']);
});

test('combination-sum-3 k=4 n=1 无解', () => {
  assert.deepEqual(combinationSum3(4, 1), []);
});

test('combination-sum-3 k=2 n=18 越界无解', () => {
  // 最大 8+9=17 < 18
  assert.deepEqual(combinationSum3(2, 18), []);
});

test('combination-sum-3 每个组合恰好 k 个且和为 n', () => {
  const result = combinationSum3(3, 15);
  for (const c of result) {
    assert.equal(c.length, 3);
    assert.equal(
      c.reduce((a, b) => a + b, 0),
      15,
    );
    // 升序
    for (let i = 1; i < c.length; i++) assert.ok(c[i]! > c[i - 1]!);
    // 数字范围 1..9
    for (const v of c) assert.ok(v >= 1 && v <= 9);
  }
});

test('combination-sum-3 结果无重复', () => {
  const result = combinationSum3(4, 20);
  const seen = new Set<string>();
  for (const c of result) {
    const key = c.join(',');
    assert.ok(!seen.has(key));
    seen.add(key);
  }
});

test('combination-sum-3 k=9 n=45 唯一解（1..9）', () => {
  assert.deepEqual(asStrs(combinationSum3(9, 45)), ['1,2,3,4,5,6,7,8,9']);
});

test('combination-sum-3 钩子被调用', () => {
  let combos = 0;
  let picks = 0;
  combinationSum3(3, 9, {
    onCombination: () => combos++,
    onPick: () => picks++,
  });
  assert.equal(combos, 3);
  assert.ok(picks > 0);
});
