import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slopeTrick } from '../../src/algorithms/dp/slope-trick/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/slope-trick/trace.ts';

/** 暴力：贪心取非递减上界，求代价。 */
function bruteCost(a: number[]): number {
  const b = [...a];
  for (let i = 1; i < a.length; i++) if (b[i]! < b[i - 1]!) b[i] = b[i - 1]!;
  let cost = 0;
  for (let i = 0; i < a.length; i++) cost += Math.abs(a[i]! - b[i]!);
  return cost;
}

test('slope-trick 代价与暴力一致', () => {
  const cases = [
    [5, 2, 8, 1, 9, 3, 7, 4, 6],
    [3, 1, 2],
    [2, 1],
    [1, 2, 3],
    [5, 4, 3, 2, 1],
    [10, 1, 10, 1],
  ];
  for (const a of cases) assert.equal(slopeTrick(a).cost, bruteCost(a));
});

test('slope-trick 结果数组非递减', () => {
  const cases = [
    [5, 2, 8, 1, 9, 3, 7, 4, 6],
    [5, 4, 3, 2, 1],
    [10, 1, 10, 1],
  ];
  for (const a of cases) {
    const { result } = slopeTrick(a);
    for (let i = 1; i < result.length; i++) {
      assert.ok(result[i]! >= result[i - 1]!, `result[${i}] 应 >= result[${i - 1}]`);
    }
  }
});

test('slope-trick 已递增数组代价为 0', () => {
  assert.equal(slopeTrick([1, 2, 3, 4]).cost, 0);
});

test('slope-trick 边界', () => {
  assert.equal(slopeTrick([]).cost, 0);
  assert.deepEqual(slopeTrick([7]).result, [7]);
});

test('slope-trick 钩子被调用', () => {
  let elements = 0;
  slopeTrick([3, 1, 2], { onElement: () => elements++ });
  assert.equal(elements, 3);
});

test('slope-trick buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
