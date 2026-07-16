import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobius, mobiusSieve } from '../../src/algorithms/math/mobius/impl.ts';

test('mobius 定义值', () => {
  assert.equal(mobius(1), 1);
  // 素数 → −1
  assert.equal(mobius(2), -1);
  assert.equal(mobius(3), -1);
  assert.equal(mobius(7), -1);
  // 两个不同素数之积 → 1
  assert.equal(mobius(6), 1); // 2·3
  assert.equal(mobius(10), 1); // 2·5
  assert.equal(mobius(30), -1); // 2·3·5 → (−1)^3
  // 含平方因子 → 0
  assert.equal(mobius(4), 0); // 2^2
  assert.equal(mobius(8), 0); // 2^3
  assert.equal(mobius(12), 0); // 2^2·3
  assert.equal(mobius(18), 0); // 2·3^2
  assert.equal(mobius(9), 0);
});

test('mobius 非法输入抛错', () => {
  assert.throws(() => mobius(0), RangeError);
  assert.throws(() => mobius(-2), RangeError);
});

test('mobiusSieve 与单值一致', () => {
  const mu = mobiusSieve(50);
  assert.equal(mu.length, 51);
  assert.equal(mu[1], 1);
  for (let n = 1; n <= 50; n++) {
    assert.equal(mu[n], mobius(n), `mu[${n}] mismatch`);
  }
});

test('mobiusSieve 经典前缀 μ(1..12)', () => {
  const mu = mobiusSieve(12);
  assert.deepEqual(mu.slice(1), [1, -1, -1, 0, -1, 1, -1, 0, 0, 1, -1, 0]);
});

test('mobius 钩子被调用', () => {
  let factors = 0;
  let square = 0;
  let done = 0;
  const r = mobius(18, {
    onFactor: () => factors++,
    onSquareFactor: () => square++,
    onDone: () => done++,
  });
  assert.equal(r, 0); // 18=2·3^2
  assert.ok(factors >= 1);
  assert.equal(square, 1, '18 含 3^2 应触发一次平方因子');
  assert.equal(done, 1);
});

test('mobiusSieve 钩子被调用', () => {
  let primes = 0;
  let values = 0;
  let done = 0;
  mobiusSieve(20, {
    onSievePrime: () => primes++,
    onSieveValue: () => values++,
    onSieveDone: () => done++,
  });
  assert.equal(primes, 8); // 8 个素数 ≤ 20
  assert.ok(values >= 20);
  assert.equal(done, 1);
});
