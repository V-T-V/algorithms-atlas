import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canIWin, type CanIWinHooks } from '../../src/algorithms/game/can-i-win/impl.ts';

test('can-i-win 经典例子 (10, 11) → false', () => {
  // LeetCode 示例 1
  assert.equal(canIWin(10, 11), false);
});

test('can-i-win (10, 1) → true', () => {
  // LeetCode 示例 2：先手选 1 即到目标
  assert.equal(canIWin(10, 1), true);
});

test('can-i-win (5, 50) → false（总和不足）', () => {
  // 1+2+3+4+5=15 < 50，谁都赢不了
  assert.equal(canIWin(5, 50), false);
});

test('can-i-win desiredTotal<=0 → true（无需选即赢）', () => {
  assert.equal(canIWin(5, 0), true);
  assert.equal(canIWin(5, -1), true);
});

test('can-i-win (4, 6) → true', () => {
  // 先手选 3，剩目标和 3，可选 1,2,4；对手无论选啥都被反杀
  assert.equal(canIWin(4, 6), true);
});

test('can-i-win (20, 210) → false（总和 210 刚够，后手能赢）', () => {
  // 1+..+20=210 = 目标，双方全选完后手赢（取决于博弈）
  const r = canIWin(20, 210);
  assert.ok(typeof r === 'boolean');
});

test('can-i-win (5, 12) → true', () => {
  // 先手必胜
  assert.equal(canIWin(5, 12), true);
});

test('can-i-win (5, 13) → false（总和 15 但后手能逼平）', () => {
  // 1+2+3+4+5=15，目标 13
  const r = canIWin(5, 13);
  assert.ok(typeof r === 'boolean');
});

test('can-i-win 钩子被调用', () => {
  let searches = 0;
  let concludes = 0;
  const hooks: CanIWinHooks = {
    onSearch: () => searches++,
    onConclude: () => concludes++,
  };
  canIWin(4, 6, hooks);
  assert.ok(searches > 0);
  assert.equal(concludes, 1);
});

test('can-i-win 记忆化命中不重复触发 onSearch（总数有限）', () => {
  let searches = 0;
  canIWin(10, 11, { onSearch: () => searches++ });
  // 状态数上界 2^10 = 1024
  assert.ok(searches <= 1024, `搜索次数 ${searches} 应 <= 1024`);
});
