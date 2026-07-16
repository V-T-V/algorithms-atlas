import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diceRoll } from '../../src/algorithms/dp/dp-dice-roll/impl.ts';

test('dice-roll 两枚 6 面骰子和为 7 = 6 种', () => {
  // 经典：2 个 6 面骰子点数和 7 的方案数 = 6
  assert.equal(diceRoll({ faces: 6, rolls: 2, target: 7 }).ways, 6);
});

test('dice-roll 单骰目标 = 面 = 1', () => {
  assert.equal(diceRoll({ faces: 6, rolls: 1, target: 3 }).ways, 1);
});

test('dice-roll 目标超出范围 = 0', () => {
  // 1 骰最大 6，目标 7 不可能
  assert.equal(diceRoll({ faces: 6, rolls: 1, target: 7 }).ways, 0);
});

test('dice-roll 目标小于最小点 = 0', () => {
  // 2 骰最小和 2，目标 1 不可能
  assert.equal(diceRoll({ faces: 6, rolls: 2, target: 1 }).ways, 0);
});

test('dice-roll 2 面骰子（硬币）掷 3 次 和为 3', () => {
  // 2 面骰（1/2），掷 3 次和为 3：只有 1+1+1 = 1 种
  assert.equal(diceRoll({ faces: 2, rolls: 3, target: 3 }).ways, 1);
});

test('dice-roll 钩子被调用', () => {
  let cells = 0;
  diceRoll({ faces: 6, rolls: 2, target: 7 }, { onCell: () => cells++ });
  assert.ok(cells > 0);
});
