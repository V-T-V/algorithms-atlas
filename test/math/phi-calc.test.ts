import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phi } from '../../src/algorithms/math/phi-calc/impl.ts';

test('phi 已知值', () => {
  assert.equal(phi(1), 1n);
  assert.equal(phi(2), 1n);
  assert.equal(phi(9), 6n);
  assert.equal(phi(10), 4n);
  assert.equal(phi(36), 12n);
  assert.equal(phi(100), 40n);
});

test('phi 素数 p = p-1', () => {
  for (const p of [2n, 3n, 7n, 13n, 97n, 1009n]) assert.equal(phi(p), p - 1n);
});

test('phi 与朴素定义一致（小范围）', () => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  for (let n = 1; n <= 100; n++) {
    let cnt = 0;
    for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) cnt++;
    assert.equal(phi(n), BigInt(cnt), `φ(${n})`);
  }
});

test('phi 大数', () => {
  // φ(10^12) = 10^12 · (1/2)·(4/5) = 4·10^11
  assert.equal(phi(1000000000000n), 400000000000n);
});

test('phi 积性（互素时）', () => {
  // φ(mn) = φ(m)φ(n) when gcd(m,n)=1
  assert.equal(phi(15n), phi(3n) * phi(5n)); // gcd(3,5)=1
  assert.equal(phi(35n), phi(5n) * phi(7n));
});

test('phi 错误输入', () => {
  assert.throws(() => phi(0), RangeError);
});
