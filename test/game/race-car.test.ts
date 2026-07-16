import { test } from 'node:test';
import assert from 'node:assert/strict';
import { raceCar, type RaceCarHooks } from '../../src/algorithms/game/race-car/impl.ts';

test('race-car target=3 → 2', () => {
  // LeetCode 示例：AA (0→1→3) 直达
  assert.equal(raceCar(3), 2);
});

test('race-car target=6 → 5', () => {
  // LeetCode 示例：AARAA (0→1→3, R, 0→1→3... 实际 5 步)
  assert.equal(raceCar(6), 5);
});

test('race-car target=0 → 0', () => {
  assert.equal(raceCar(0), 0);
});

test('race-car target=1 → 1', () => {
  // A: 0→1
  assert.equal(raceCar(1), 1);
});

test('race-car target=2 → 4', () => {
  // A(0→1) A(1→3) R(s=-1) A(3→2) → 4 步
  assert.equal(raceCar(2), 4);
});

test('race-car target=5 → 7', () => {
  // 已知答案
  assert.equal(raceCar(5), 7);
});

test('race-car target=4 → 5', () => {
  // A(0→1) A(1→3) A(3→7) R(s=-1) ... 实际 5 步：AARA...
  assert.equal(raceCar(4), 5);
});

test('race-car 步数单调有界（小范围）', () => {
  // 各 target 应得到合理步数
  for (let t = 1; t <= 20; t++) {
    const r = raceCar(t);
    assert.ok(r > 0, `target=${t} 步数应为正`);
    assert.ok(r < 60, `target=${t} 步数 ${r} 应合理`);
  }
});

test('race-car 钩子被调用', () => {
  let expands = 0;
  let done = 0;
  const hooks: RaceCarHooks = {
    onExpand: () => expands++,
    onDone: () => done++,
  };
  raceCar(3, hooks);
  assert.ok(expands > 0);
  assert.equal(done, 1);
});
