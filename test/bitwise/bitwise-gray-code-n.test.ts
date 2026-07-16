import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grayCodeN, grayCodeAt } from '../../src/algorithms/bitwise/bitwise-gray-code-n/impl.ts';

test('grayCodeN 序列长度 = 2^n', () => {
  assert.equal(grayCodeN(0).length, 1);
  assert.equal(grayCodeN(3).length, 8);
  assert.equal(grayCodeN(5).length, 32);
});

test('grayCodeN 经典 3 位序列', () => {
  assert.deepEqual(grayCodeN(3), [0, 1, 3, 2, 6, 7, 5, 4]);
});

test('grayCodeN 相邻只差 1 位（格雷码性质）', () => {
  for (const n of [1, 2, 3, 5, 8]) {
    const codes = grayCodeN(n);
    for (let i = 1; i < codes.length; i++) {
      const diff = codes[i - 1]! ^ codes[i]!;
      assert.equal(popcount(diff), 1, `n=${n} 相邻 ${i - 1},${i} 差多位`);
    }
  }
});

test('grayCodeAt 公式', () => {
  assert.equal(grayCodeAt(0), 0);
  assert.equal(grayCodeAt(1), 1);
  assert.equal(grayCodeAt(2), 3);
  assert.equal(grayCodeAt(3), 2);
});

test('grayCodeN 拒绝负数', () => {
  assert.throws(() => grayCodeN(-1), RangeError);
});

function popcount(n: number): number {
  let c = 0;
  let x = n;
  while (x > 0) {
    x -= x & -x;
    c++;
  }
  return c;
}
