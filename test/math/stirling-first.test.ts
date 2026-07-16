import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stirlingFirst, stirlingFirstBig } from '../../src/algorithms/math/stirling-first/impl.ts';

const MOD = 1_000_000_007;

test('stirling-first 已知值 s(5,k)', () => {
  // s(5,*) = 24, 50, 35, 10, 1
  assert.equal(stirlingFirst(5, 1, MOD), 24);
  assert.equal(stirlingFirst(5, 2, MOD), 50);
  assert.equal(stirlingFirst(5, 3, MOD), 35);
  assert.equal(stirlingFirst(5, 4, MOD), 10);
  assert.equal(stirlingFirst(5, 5, MOD), 1);
});

test('stirling-first 边界', () => {
  assert.equal(stirlingFirst(0, 0, MOD), 1);
  assert.equal(stirlingFirst(5, 0, MOD), 0);
  assert.equal(stirlingFirst(3, 5, MOD), 0);
});

test('stirling-first 行和 = n!', () => {
  for (let n = 1; n <= 8; n++) {
    let sum = 0;
    for (let k = 0; k <= n; k++) sum = (sum + stirlingFirst(n, k, MOD)) % MOD;
    let fact = 1;
    for (let i = 2; i <= n; i++) fact = (fact * i) % MOD;
    assert.equal(sum, fact, `n=${n}`);
  }
});

test('stirling-first BigInt', () => {
  assert.equal(stirlingFirstBig(5, 2), 50n);
  assert.equal(stirlingFirstBig(8, 3), 13132n);
});

test('stirling-first 钩子', () => {
  let cells = 0;
  stirlingFirst(3, 2, MOD, { onCell: () => cells++ });
  assert.ok(cells > 0);
});
