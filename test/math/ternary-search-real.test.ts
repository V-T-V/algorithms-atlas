import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ternarySearch,
  ternarySearchDiscrete,
} from '../../src/algorithms/math/ternary-search-real/impl.ts';

test('ternarySearch 求二次函数极大值', () => {
  // f(x) = -(x-3)^2 + 9，极大值在 x=3，f=9
  const f = (x: number): number => -(x - 3) * (x - 3) + 9;
  const { x, fx } = ternarySearch(f, -10, 10, {}, 1e-9, true);
  assert.ok(Math.abs(x - 3) < 1e-4, `x≈3, got ${x}`);
  assert.ok(Math.abs(fx - 9) < 1e-4, `f(x)≈9, got ${fx}`);
});

test('ternarySearch 求二次函数极小值', () => {
  // f(x) = (x-2)^2 + 5，极小值在 x=2，f=5
  const f = (x: number): number => (x - 2) * (x - 2) + 5;
  const { x, fx } = ternarySearch(f, -5, 8, {}, 1e-9, false);
  assert.ok(Math.abs(x - 2) < 1e-4, `x≈2, got ${x}`);
  assert.ok(Math.abs(fx - 5) < 1e-4, `f(x)≈5, got ${fx}`);
});

test('ternarySearch 区间不含真正极值时返回边界附近', () => {
  // f 上升，[0,2] 内极大值在右边界附近
  const f = (x: number): number => x;
  const { x } = ternarySearch(f, 0, 2, {}, 1e-9, true);
  assert.ok(x > 1.9, `应接近右边界 2，got ${x}`);
});

test('ternarySearch 非法区间抛错', () => {
  assert.throws(() => ternarySearch((x: number) => x, 5, 5), RangeError);
  assert.throws(() => ternarySearch((x: number) => x, 5, 1), RangeError);
});

test('ternarySearch 钩子被调用', () => {
  let probes = 0;
  let shrinks = 0;
  let done = 0;
  ternarySearch(
    (x: number) => -(x - 1) * (x - 1),
    -5,
    5,
    {
      onProbe: () => probes++,
      onShrink: () => shrinks++,
      onDone: () => done++,
    },
    1e-6,
    true,
  );
  assert.ok(probes >= 5, '应多次探针');
  assert.equal(shrinks, probes, '每次 probe 后应 shrink 一次');
  assert.equal(done, 1);
});

test('ternarySearchDiscrete 求峰值下标', () => {
  // 1,3,7,9,8,5,2 → 峰值在 9（下标 3）
  assert.equal(ternarySearchDiscrete([1, 3, 7, 9, 8, 5, 2]), 3);
  // 单调递增 → 最后一个
  assert.equal(ternarySearchDiscrete([1, 2, 3, 4, 5]), 4);
  // 单调递减 → 第一个
  assert.equal(ternarySearchDiscrete([5, 4, 3, 2, 1]), 0);
  // 平顶：返回任一取最大值的下标
  const plateau = ternarySearchDiscrete([1, 5, 5, 5, 1]);
  assert.equal([1, 5, 5, 5, 1][plateau], 5);
});

test('ternarySearchDiscrete 空数组抛错', () => {
  assert.throws(() => ternarySearchDiscrete([]), RangeError);
});
