import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countDp, binomial, type GridPathInput } from '../../src/algorithms/dp/count-dp/impl.ts';

test('count-dp 演示默认 4×4 = 20', () => {
  const { count } = countDp({ rows: 4, cols: 4 });
  // C(6,3) = 20
  assert.equal(count, 20);
});

test('count-dp 与组合数闭式一致', () => {
  for (const [m, n] of [
    [1, 1],
    [2, 2],
    [3, 2],
    [3, 7],
    [5, 5],
    [6, 4],
  ] as Array<[number, number]>) {
    const { count } = countDp({ rows: m, cols: n });
    assert.equal(count, binomial(m + n - 2, m - 1), `${m}×${n}`);
  }
});

test('count-dp 1×n 与 m×1 恒为 1', () => {
  assert.equal(countDp({ rows: 1, cols: 10 }).count, 1);
  assert.equal(countDp({ rows: 10, cols: 1 }).count, 1);
});

test('count-dp 2×2 = 2', () => {
  // 右右下下 / 下下右右 共... 实际 2 条：右→下、下→右
  assert.equal(countDp({ rows: 2, cols: 2 }).count, 2);
});

test('count-dp 3×3 = 6', () => {
  assert.equal(countDp({ rows: 3, cols: 3 }).count, 6);
});

test('count-dp 非法规模返回 0', () => {
  assert.equal(countDp({ rows: 0, cols: 5 }).count, 0);
  assert.equal(countDp({ rows: 5, cols: 0 }).count, 0);
});

test('count-dp dp 表首行首列全为 1', () => {
  const { dp } = countDp({ rows: 4, cols: 5 });
  for (let j = 0; j < 5; j++) assert.equal(dp[0]![j], 1);
  for (let i = 0; i < 4; i++) assert.equal(dp[i]![0], 1);
});

test('count-dp 满足转移式 dp[i][j]=dp[i-1][j]+dp[i][j-1]', () => {
  const { dp } = countDp({ rows: 5, cols: 5 });
  for (let i = 1; i < 5; i++) {
    for (let j = 1; j < 5; j++) {
      assert.equal(dp[i]![j], dp[i - 1]![j]! + dp[i]![j - 1]!);
    }
  }
});

test('count-dp 钩子被调用', () => {
  let cells = 0;
  let doneCount = -1;
  countDp({ rows: 4, cols: 4 } as GridPathInput, {
    onFillCell: () => cells++,
    onDone: (c) => {
      doneCount = c;
    },
  });
  assert.equal(cells, 16, '每格填一次');
  assert.equal(doneCount, 20);
});
