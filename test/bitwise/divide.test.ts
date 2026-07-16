import { test } from 'node:test';
import assert from 'node:assert/strict';
import { divide } from '../../src/algorithms/bitwise/divide/impl.ts';

const truncDiv = (a: number, b: number): number => Math.trunc(a / b);

test('divide 基本行为', () => {
  assert.deepEqual(divide(43, 5), { quotient: 8, remainder: 3 });
  assert.deepEqual(divide(10, 2), { quotient: 5, remainder: 0 });
  assert.deepEqual(divide(7, 7), { quotient: 1, remainder: 0 });
  assert.deepEqual(divide(3, 5), { quotient: 0, remainder: 3 });
});

test('divide 商一致：a = q*b + r', () => {
  const cases: Array<[number, number]> = [
    [100, 7],
    [255, 16],
    [1024, 32],
    [999999, 1000],
    [1, 1],
  ];
  for (const [a, b] of cases) {
    const { quotient, remainder } = divide(a, b);
    assert.equal(quotient, truncDiv(a, b), `商 a=${a} b=${b}`);
    assert.equal(a, quotient * b + remainder, `恒等 a=${a}`);
    assert.equal(remainder, a - truncDiv(a, b) * b, `余数 a=${a}`);
  }
});

test('divide 负数（向零截断）', () => {
  assert.deepEqual(divide(-43, 5), { quotient: -8, remainder: -3 });
  assert.deepEqual(divide(43, -5), { quotient: -8, remainder: 3 });
  assert.deepEqual(divide(-43, -5), { quotient: 8, remainder: -3 });
});

test('divide 除以零抛错', () => {
  assert.throws(() => divide(10, 0));
});

test('divide 钩子被调用', () => {
  const fits: number[] = [];
  const { quotient } = divide(43, 5, {
    onStep: ({ shift, fit }) => {
      if (fit) fits.push(shift);
    },
  });
  assert.equal(quotient, 8); // 8 = 0b1000 -> shift 3
  assert.deepEqual(fits, [3]);
});
