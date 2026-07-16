import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extGcdFull,
  modInverse,
  solveDiophantine,
} from '../../src/algorithms/math/exgcd-extended/impl.ts';

test('extGcdFull gcd 与 Bézout 等式', () => {
  for (const [a, b] of [
    [240n, 46n],
    [1071n, 462n],
    [13n, 0n],
    [0n, 7n],
  ] as const) {
    const { g, x, y } = extGcdFull(a, b);
    assert.equal(a * x + b * y, g, `Bézout for ${a},${b}`);
  }
});

test('extGcdFull gcd(240,46)=2', () => {
  assert.equal(extGcdFull(240n, 46n).g, 2n);
  assert.equal(extGcdFull(1071n, 462n).g, 21n);
});

test('modInverse 费马小例子', () => {
  // 3^-1 mod 7 = 5
  assert.equal(modInverse(3n, 7n), 5n);
  assert.equal((3n * modInverse(3n, 11n)) % 11n, 1n);
});

test('modInverse 非互素抛错', () => {
  assert.throws(() => modInverse(2n, 4n), /not coprime/);
});

test('solveDiophantine 通解', () => {
  // 3x + 5y = 1，gcd=1 整除
  const sol = solveDiophantine(3n, 5n, 1n)!;
  assert.equal(3n * sol.x0 + 5n * sol.y0, 1n);
  // 通解验证：x = x0 + k·dx, y = y0 - k·dy（这里 dx=5, dy=3）
  for (const k of [-2n, -1n, 0n, 1n, 2n]) {
    const x = sol.x0 + k * sol.dx;
    const y = sol.y0 - k * sol.dy;
    assert.equal(3n * x + 5n * y, 1n);
  }
});

test('solveDiophantine 无解', () => {
  // 2x + 4y = 1，gcd=2 不整除 1
  assert.equal(solveDiophantine(2n, 4n, 1n), null);
});
