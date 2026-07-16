import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minMax } from '../../src/algorithms/bitwise/min-max/impl.ts';

test('min-max 基本行为', () => {
  assert.deepEqual(minMax(5, 9), { min: 5, max: 9 });
  assert.deepEqual(minMax(12, 3), { min: 3, max: 12 });
  assert.deepEqual(minMax(8, 8), { min: 8, max: 8 });
  assert.deepEqual(minMax(-4, 7), { min: -4, max: 7 });
  assert.deepEqual(minMax(-10, -3), { min: -10, max: -3 });
});

test('min-max 与 Math.min/max 一致（含大数与小数）', () => {
  // 注意：差值接近 INT 极值时会有 32 位溢出（见 meta 说明），故不包含 [INT_MAX, INT_MIN]
  const samples = [
    [0, 0],
    [1, 2],
    [2, 1],
    [-1, -2],
    [1000, -1000],
    [12345, 12344],
    [2147483647, 0],
    [0, -2147483648],
  ];
  for (const [a, b] of samples) {
    const { min, max } = minMax(a!, b!);
    assert.equal(min, Math.min(a!, b!), `min(${a},${b})`);
    assert.equal(max, Math.max(a!, b!), `max(${a},${b})`);
  }
});

test('min-max 钩子被调用', () => {
  let called = 0;
  const r = minMax(5, 9, {
    onResolve: (a, b, diff, min, max) => {
      called++;
      assert.equal(diff, 4);
      assert.equal(min, 5);
      assert.equal(max, 9);
    },
  });
  assert.deepEqual(r, { min: 5, max: 9 });
  assert.equal(called, 1);
});
