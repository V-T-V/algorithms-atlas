import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinChange } from '../../src/algorithms/dp/coin-change/impl.ts';

// 校验方案合法：硬币和等于 amount、个数等于 count、且都来自 coins
function checkSolution(coins: number[], amount: number, expectCount: number): void {
  const { count, coins: picked } = coinChange(coins, amount);
  assert.equal(count, expectCount, `count mismatch for amount ${amount}`);
  if (expectCount === -1) {
    assert.equal(picked, null);
    return;
  }
  assert.ok(picked !== null, '应有方案');
  assert.equal(picked.length, expectCount, '硬币数应等于 count');
  const sum = picked.reduce((a, b) => a + b, 0);
  assert.equal(sum, amount, `方案之和 ${sum} ≠ amount ${amount}`);
  for (const c of picked) {
    assert.ok(coins.includes(c), `硬币 ${c} 不在面额中`);
  }
}

test('coin-change 经典 [1,2,5] amount=11 → 3', () => {
  checkSolution([1, 2, 5], 11, 3);
});

test('coin-change 基本行为', () => {
  assert.deepEqual(coinChange([1, 2, 5], 0), { count: 0, coins: [] });
  assert.deepEqual(coinChange([1, 2, 5], -5), { count: -1, coins: null });
});

test('coin-change 无法凑出', () => {
  assert.equal(coinChange([2], 3).count, -1); // 3 是奇数，只有 2 无法凑
  assert.equal(coinChange([5, 10], 3).count, -1);
  assert.equal(coinChange([3, 7], 5).count, -1);
});

test('coin-change 单一面额', () => {
  // 只有 3，凑 9 → 3 枚
  const r = coinChange([3], 9);
  assert.equal(r.count, 3);
  assert.deepEqual(r.coins, [3, 3, 3]);
});

test('coin-change 贪心失效（必须 DP）', () => {
  // [1,3,4] amount=6：贪心会选 4+1+1=3 枚，但最优 3+3=2 枚
  const r = coinChange([1, 3, 4], 6);
  assert.equal(r.count, 2);
  assert.deepEqual(
    r.coins?.slice().sort((a, b) => a - b),
    [3, 3],
  );
});

test('coin-change 面额含 1 总能凑出', () => {
  for (const amt of [1, 5, 13, 100]) {
    const r = coinChange([1], amt);
    assert.equal(r.count, amt);
  }
});

test('coin-change 去重：重复面额不影响结果', () => {
  const a = coinChange([1, 2, 5], 11).count;
  const b = coinChange([1, 1, 2, 2, 5, 5], 11).count;
  assert.equal(a, b);
});

test('coin-change 过滤非正面额', () => {
  const r = coinChange([1, 2, -3, 0, 5], 11);
  assert.equal(r.count, 3);
});

test('coin-change 大金额', () => {
  const r = coinChange([1, 2, 5], 100);
  assert.equal(r.count, 20); // 全用 5
});

test('coin-change 钩子被调用', () => {
  let tries = 0;
  let sets = 0;
  let picks = 0;
  coinChange([1, 2, 5], 11, {
    onTryCoin: () => tries++,
    onSetValue: () => sets++,
    onPickCoin: () => picks++,
  });
  assert.ok(tries > 0, '应尝试硬币');
  assert.equal(sets, 12); // 0..11 共 12 个值
  assert.equal(picks, 3); // 最少 3 枚
});

test('coin-change 钩子：不可凑出时不触发 onPickCoin', () => {
  let picks = 0;
  coinChange([2], 3, { onPickCoin: () => picks++ });
  assert.equal(picks, 0);
});
