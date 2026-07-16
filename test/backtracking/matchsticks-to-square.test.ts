import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  matchsticksToSquare,
  type MatchsticksToSquareHooks,
} from '../../src/algorithms/backtracking/matchsticks-to-square/impl.ts';

test('matchsticks-to-square [1,1,2,2,2] 可拼', () => {
  const r = matchsticksToSquare([1, 1, 2, 2, 2]);
  assert.equal(r.canForm, true);
  assert.deepEqual(r.sides, [2, 2, 2, 2]);
});

test('matchsticks-to-square [3,3,3,3,4] 不可拼', () => {
  // 周长 16，边长 4；但 3+? 无法凑 4（只剩 4 一根 >4? no 4==4）
  // 实际：4 一根成一边，剩 [3,3,3,3] 每边 4 需 3+1 无 1 → 不可
  assert.equal(matchsticksToSquare([3, 3, 3, 3, 4]).canForm, false);
});

test('matchsticks-to-square 周长不能被4整除', () => {
  assert.equal(matchsticksToSquare([1, 1, 1]).canForm, false);
  assert.equal(matchsticksToSquare([2, 2, 2]).canForm, false);
});

test('matchsticks-to-square 单根超长', () => {
  // 边长 3，但有一根 5 > 3
  assert.equal(matchsticksToSquare([1, 1, 1, 5]).canForm, false);
});

test('matchsticks-to-square [5,5,5,5,4,4,4,4,3,3,3,3]', () => {
  // 经典可拼
  assert.equal(matchsticksToSquare([5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3]).canForm, true);
});

test('matchsticks-to-square 空/单元素', () => {
  assert.equal(matchsticksToSquare([]).canForm, false);
  assert.equal(matchsticksToSquare([1]).canForm, false);
});

test('matchsticks-to-square [4,3,3,2,2,1,1]', () => {
  // 周长 16，边长 4：4 | 3+1 | 3+1 | 2+2
  assert.equal(matchsticksToSquare([4, 3, 3, 2, 2, 1, 1]).canForm, true);
});

test('matchsticks-to-square 成功时四边都等于 side', () => {
  const r = matchsticksToSquare([1, 1, 2, 2, 2]);
  if (r.canForm) {
    assert.ok(r.sides.every((s) => s === 2));
  }
});

test('matchsticks-to-square 钩子被调用', () => {
  let places = 0;
  let success = 0;
  const hooks: MatchsticksToSquareHooks = {
    onPlace: () => places++,
    onSuccess: () => success++,
  };
  matchsticksToSquare([1, 1, 2, 2, 2], hooks);
  assert.ok(places > 0);
  assert.equal(success, 1);
});
