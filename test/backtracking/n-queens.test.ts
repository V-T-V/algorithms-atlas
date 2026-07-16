import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nQueens, countNQueens } from '../../src/algorithms/backtracking/n-queens/impl.ts';

test('n-queens 边界情况', () => {
  assert.deepEqual(nQueens(0), []);
  assert.deepEqual(nQueens(1), [[0]]);
});

test('n-queens 无解情况（n=2, n=3）', () => {
  assert.deepEqual(nQueens(2), []);
  assert.deepEqual(nQueens(3), []);
});

test('n-queens 解的数量正确', () => {
  // 经典已知值
  assert.equal(nQueens(4).length, 2);
  assert.equal(nQueens(5).length, 10);
  assert.equal(nQueens(6).length, 4);
  assert.equal(nQueens(7).length, 40);
  assert.equal(nQueens(8).length, 92);
  assert.equal(countNQueens(8), 92);
});

test('n-queens 每个解都互不攻击', () => {
  const checkNoConflict = (sol: number[]): boolean => {
    for (let r1 = 0; r1 < sol.length; r1++) {
      for (let r2 = r1 + 1; r2 < sol.length; r2++) {
        const c1 = sol[r1]!;
        const c2 = sol[r2]!;
        if (c1 === c2) return false; // 同列
        if (Math.abs(r1 - r2) === Math.abs(c1 - c2)) return false; // 同对角线
      }
    }
    return true;
  };
  for (const sol of nQueens(6)) {
    assert.equal(sol.length, 6);
    assert.ok(checkNoConflict(sol), '解中皇后不应互相攻击');
  }
});

test('n-queens n=4 第一个解为已知形式', () => {
  // 4 皇后的两个解：[1,3,0,2] 与 [2,0,3,1]
  const sols = nQueens(4).map((s) => s.join(','));
  assert.ok(sols.includes('1,3,0,2'));
  assert.ok(sols.includes('2,0,3,1'));
});

test('n-queens maxSolutions 限流生效', () => {
  const limited = nQueens(8, {}, { maxSolutions: 3 });
  assert.equal(limited.length, 3);
});

test('n-queens 钩子被调用', () => {
  let places = 0;
  let backtracks = 0;
  let solutions = 0;
  nQueens(4, {
    onPlace: () => places++,
    onBacktrack: () => backtracks++,
    onSolution: () => solutions++,
  });
  assert.ok(places > 0, '应触发至少一次放置');
  assert.ok(backtracks > 0, '应触发至少一次回溯');
  assert.equal(solutions, 2);
});
