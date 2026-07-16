import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countNQueens,
  N_QUEENS_COUNT,
  type NQueens2Hooks,
} from '../../src/algorithms/backtracking/n-queens-2/impl.ts';

test('n-queens-2 已知解数表（n=1..8）', () => {
  // [1,0,0,2,10,4,40,92]
  const expected = [1, 0, 0, 2, 10, 4, 40, 92];
  for (let n = 1; n <= 8; n++) {
    assert.equal(countNQueens(n), expected[n - 1]!, `n=${n}`);
  }
});

test('n-queens-2 与内置解数表一致（n=1..12）', () => {
  for (let n = 1; n <= 12; n++) {
    assert.equal(countNQueens(n), N_QUEENS_COUNT[n]!, `n=${n}`);
  }
});

test('n-queens-2 经典值', () => {
  assert.equal(countNQueens(1), 1);
  assert.equal(countNQueens(4), 2);
  assert.equal(countNQueens(8), 92);
});

test('n-queens-2 非法输入返回 0', () => {
  assert.equal(countNQueens(0), 0);
  assert.equal(countNQueens(-3), 0);
});

test('n-queens-2 钩子被调用', () => {
  let places = 0;
  let backtracks = 0;
  let solutions = 0;
  let done = 0;
  const hooks: NQueens2Hooks = {
    onPlace: () => places++,
    onBacktrack: () => backtracks++,
    onSolution: () => solutions++,
    onDone: () => done++,
  };
  const total = countNQueens(5, hooks);
  assert.equal(total, 10);
  assert.equal(solutions, 10);
  assert.equal(done, 1);
  assert.ok(places > 0, '应有放置事件');
  assert.ok(backtracks > 0, '应有回溯事件');
});

test('n-queens-2 onSolution 计数单调递增', () => {
  let prev = 0;
  countNQueens(6, {
    onSolution: (cnt) => {
      assert.ok(cnt > prev, `计数应递增: ${cnt} > ${prev}`);
      prev = cnt;
    },
  });
  assert.equal(prev, 4);
});
