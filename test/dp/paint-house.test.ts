import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paintHouse } from '../../src/algorithms/dp/paint-house/impl.ts';

test('paint-house 基本行为', () => {
  assert.equal(paintHouse([]), 0);
  assert.equal(paintHouse([[5, 3, 7]]), 3);
});

test('paint-house 经典用例', () => {
  // LeetCode 256 示例：答案 10（蓝 蓝 绿 不合法，需相邻异色）
  //   房0=蓝17, 房1=绿5+min(红17,蓝17)... 实际最优 房0=绿(2),房1=蓝(5),房2=绿(3) = 10
  assert.equal(
    paintHouse([
      [17, 2, 17],
      [16, 16, 5],
      [14, 3, 19],
    ]),
    10,
  );
});

test('paint-house 暴力对拍', () => {
  // 暴力 dp[i][c] = cost + min(dp[i-1][k], k!=c)
  const brute = (costs: number[][]): number => {
    const n = costs.length;
    if (n === 0) return 0;
    const k = costs[0]!.length;
    const dp = costs.map((r) => [...r]);
    for (let i = 1; i < n; i++) {
      for (let c = 0; c < k; c++) {
        let m = Infinity;
        for (let cc = 0; cc < k; cc++) if (cc !== c) m = Math.min(m, dp[i - 1]![cc]!);
        dp[i]![c] = dp[i]![c]! + m;
      }
    }
    return Math.min(...dp[n - 1]!);
  };
  const rng = (s: number) => () => (s = (s * 1103515245 + 12345) & 0x7fffffff);
  const rand = rng(42);
  for (let t = 0; t < 200; t++) {
    const n = 1 + (rand() % 6);
    const k = 1 + (rand() % 4);
    const costs: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let c = 0; c < k; c++) row.push(rand() % 20);
      costs.push(row);
    }
    assert.equal(paintHouse(costs), brute(costs), `mismatch on ${JSON.stringify(costs)}`);
  }
});

test('paint-house 钩子被调用', () => {
  let fill = 0;
  let done = -1;
  paintHouse(
    [
      [17, 2, 17],
      [16, 16, 5],
    ],
    {
      onFillCell: () => fill++,
      onDone: (v) => {
        done = v;
      },
    },
  );
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.ok(done >= 0, '应触发 onDone');
});
