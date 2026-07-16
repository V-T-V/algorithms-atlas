import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legendre } from '../../src/algorithms/math/legendre-symbol/impl.ts';

test('legendre 基本值（mod 7）', () => {
  // 模 7 二次剩余：0,1,2,4
  assert.equal(legendre(0n, 7n), 0);
  assert.equal(legendre(1n, 7n), 1);
  assert.equal(legendre(2n, 7n), 1);
  assert.equal(legendre(3n, 7n), -1);
  assert.equal(legendre(4n, 7n), 1);
  assert.equal(legendre(5n, 7n), -1);
  assert.equal(legendre(6n, 7n), -1);
});

test('legendre 模 11', () => {
  // 模 11 二次剩余：1,3,4,5,9
  for (const r of [1n, 3n, 4n, 5n, 9n]) assert.equal(legendre(r, 11n), 1);
  for (const r of [2n, 6n, 7n, 8n, 10n]) assert.equal(legendre(r, 11n), -1);
});

test('legendre 与平方枚举一致', () => {
  const p = 23n;
  const residues = new Set<string>();
  for (let x = 0n; x < p; x++) residues.add(((x * x) % p).toString());
  for (let a = 1n; a < p; a++) {
    const v = legendre(a, p);
    if (v === 1) assert.ok(residues.has(a.toString()), `${a} should be residue`);
    else assert.ok(!residues.has(a.toString()), `${a} should be non-residue`);
  }
});

test('legendre 大数', () => {
  assert.equal(legendre(2n, 1000000007n), 1); // 2 是模 1e9+7 的剩余
});

test('legendre 错误', () => {
  assert.throws(() => legendre(3, 2), RangeError);
});
