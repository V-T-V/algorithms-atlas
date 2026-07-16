import { test } from 'node:test';
import assert from 'node:assert/strict';
import { powerRecursive } from '../../src/algorithms/recursion/power-recursive/impl.ts';

test('powerRecursive 基本幂', () => {
  assert.equal(powerRecursive(2, 10), 1024);
  assert.equal(powerRecursive(3, 5), 243);
  assert.equal(powerRecursive(5, 0), 1);
  assert.equal(powerRecursive(7, 1), 7);
  assert.equal(powerRecursive(1, 1000), 1);
});

test('powerRecursive 与 Math.pow 一致（小数值）', () => {
  for (let b = 0; b < 12; b++) {
    for (let e = 0; e < 12; e++) {
      assert.equal(powerRecursive(b, e), Math.pow(b, e), `b=${b} e=${e}`);
    }
  }
});

test('powerRecursive 模幂', () => {
  assert.equal(powerRecursive(2, 10, 1000), 24);
  // 3^100 mod 7 = 3^(6*16+4) mod 7 = 3^4 mod 7 = 81 mod 7 = 4
  assert.equal(powerRecursive(3, 100, 7), 4);
  // 费马小定理：a^(p-1) ≡ 1 (mod p)，p 素
  assert.equal(powerRecursive(5, 12, 13), 1);
});

test('powerRecursive 负底数模幂', () => {
  assert.equal(powerRecursive(-3, 5, 100), (((-3) ** 5 % 100) + 100) % 100);
});

test('powerRecursive 非法指数抛错', () => {
  assert.throws(() => powerRecursive(2, -1));
  assert.throws(() => powerRecursive(2, 1.5));
});
