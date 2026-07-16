import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerTotient, eulerTotientSieve } from '../../src/algorithms/math/euler-totient/impl.ts';

test('eulerTotient 已知值', () => {
  assert.equal(eulerTotient(1), 1);
  assert.equal(eulerTotient(2), 1);
  assert.equal(eulerTotient(10), 4); // 1,3,7,9
  assert.equal(eulerTotient(36), 12);
  assert.equal(eulerTotient(7), 6); // 素数 p → p-1
  assert.equal(eulerTotient(13), 12);
});

test('eulerTotient 素数幂', () => {
  assert.equal(eulerTotient(9), 6); // 9=3^2 → 9·(1-1/3)=6
  assert.equal(eulerTotient(8), 4); // 8=2^3 → 4
  assert.equal(eulerTotient(100), 40);
});

test('eulerTotient 非法输入抛错', () => {
  assert.throws(() => eulerTotient(0), RangeError);
  assert.throws(() => eulerTotient(-3), RangeError);
});

test('eulerTotientSieve 与单值一致', () => {
  const phi = eulerTotientSieve(30);
  assert.equal(phi.length, 31);
  assert.equal(phi[1], 1);
  for (let n = 1; n <= 30; n++) {
    assert.equal(phi[n], eulerTotient(n), `phi[${n}] mismatch`);
  }
});

test('eulerTotientSieve 经典前缀', () => {
  // φ(1..10) = 1,1,2,2,4,2,6,4,6,4
  const phi = eulerTotientSieve(10);
  assert.deepEqual(phi.slice(1), [1, 1, 2, 2, 4, 2, 6, 4, 6, 4]);
});

test('eulerTotient 钩子被调用', () => {
  let factors = 0;
  let done = 0;
  const r = eulerTotient(60, {
    onFactor: () => factors++,
    onDone: () => done++,
  });
  assert.equal(r, 16); // φ(60)=60·(1/2)·(2/3)·(4/5)=16
  assert.equal(factors, 3, '60 = 2^2·3·5 → 3 个不同质因子');
  assert.equal(done, 1);
});

test('eulerTotientSieve 钩子被调用', () => {
  let primes = 0;
  let values = 0;
  let done = 0;
  eulerTotientSieve(20, {
    onSievePrime: () => primes++,
    onSieveValue: () => values++,
    onSieveDone: () => done++,
  });
  // 20 以内素数：2,3,5,7,11,13,17,19 共 8 个
  assert.equal(primes, 8);
  assert.ok(values >= 20, '应至少为 1..20 各填一次');
  assert.equal(done, 1);
});
