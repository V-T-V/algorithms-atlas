import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoneGame } from '../../src/algorithms/dp/stone-game/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/stone-game/trace.ts';

/** 递归 minimax 作对照（先手最大）。 */
function rec(a: number[]): number {
  const memo: Record<string, number> = {};
  const sumRest = (l: number, r: number) => {
    let s = 0;
    for (let k = l; k <= r; k++) s += a[k]!;
    return s;
  };
  const go = (i: number, j: number): number => {
    if (i > j) return 0;
    if (i === j) return a[i]!;
    const k = `${i},${j}`;
    if (memo[k] !== undefined) return memo[k]!;
    const left = a[i]! + (sumRest(i + 1, j) - go(i + 1, j));
    const right = a[j]! + (sumRest(i, j - 1) - go(i, j - 1));
    memo[k] = Math.max(left, right);
    return memo[k]!;
  };
  return go(0, a.length - 1);
}

test('stone-game 与 minimax 一致', () => {
  const cases = [
    [5, 3, 7, 10],
    [3, 7, 2, 3],
    [1, 5, 2, 4],
    [5, 2, 8, 1, 9, 3, 7, 4, 6],
  ];
  for (const a of cases) assert.equal(stoneGame(a), rec(a));
});

test('stone-game 先手不劣于后手', () => {
  for (const a of [
    [5, 3, 7, 10],
    [1, 5, 2, 4],
  ]) {
    const total = a.reduce((s, x) => s + x, 0);
    assert.ok(stoneGame(a) * 2 >= total, '先手应 >= 总和一半');
  }
});

test('stone-game 边界', () => {
  assert.equal(stoneGame([]), 0);
  assert.equal(stoneGame([10]), 10);
});

test('stone-game 钩子被调用', () => {
  let chooses = 0;
  let fills = 0;
  stoneGame([5, 3, 7, 10], {
    onChoose: () => chooses++,
    onFill: () => fills++,
  });
  assert.ok(chooses > 0);
  assert.ok(fills > 0);
});

test('stone-game buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
