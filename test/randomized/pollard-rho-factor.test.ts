// Pollard Rho 随机化因数分解 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  factorize,
  pollardRhoOne,
  modPow,
  bigGcd,
  isProbablePrime,
} from '../../src/algorithms/randomized/pollard-rho-factor/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/pollard-rho-factor/trace.ts';

test('modPow 基础', () => {
  assert.equal(modPow(2n, 10n, 1000n), 24n);
});

test('bigGcd 基础', () => {
  assert.equal(bigGcd(12n, 18n), 6n);
  assert.equal(bigGcd(17n, 5n), 1n);
});

test('isProbablePrime 小素数', () => {
  for (const p of [2n, 3n, 5n, 7n, 11n, 97n, 101n]) {
    assert.equal(isProbablePrime(p), true, `${p} 应为素数`);
  }
});

test('isProbablePrime 小合数', () => {
  for (const c of [4n, 6n, 9n, 15n, 561n, 1105n]) {
    assert.equal(isProbablePrime(c), false, `${c} 应为合数`);
  }
});

test('pollardRhoOne 找到 8051 的因子', () => {
  // 8051 = 83 · 97
  const d = pollardRhoOne(8051n);
  assert.ok(d !== null);
  assert.ok(d === 83n || d === 97n);
  assert.equal(8051n % d!, 0n);
});

test('pollardRhoOne 偶数返回 2', () => {
  assert.equal(pollardRhoOne(100n), 2n);
});

test('factorize 完整分解 8051', () => {
  const f = factorize(8051n);
  assert.deepEqual(f, [83n, 97n]);
});

test('factorize 含重复因子', () => {
  // 12 = 2·2·3
  assert.deepEqual(factorize(12n), [2n, 2n, 3n]);
  // 60 = 2·2·3·5
  assert.deepEqual(factorize(60n), [2n, 2n, 3n, 5n]);
});

test('factorize 素数幂', () => {
  // 1024 = 2^10
  assert.deepEqual(factorize(1024n), [2n, 2n, 2n, 2n, 2n, 2n, 2n, 2n, 2n, 2n]);
});

test('factorize 较大合数', () => {
  // 600851475143 = 71 · 839 · 1471 · 6857
  assert.deepEqual(factorize(600851475143n), [71n, 839n, 1471n, 6857n]);
});

test('factorize 因子乘积等于原数', () => {
  for (const n of [91n, 8051n, 123456789n]) {
    const f = factorize(n);
    const prod = f.reduce((a, b) => a * b, 1n);
    assert.equal(prod, n, `${n} 的因子乘积应等于自身`);
  }
});

test('钩子触发', () => {
  const starts: bigint[] = [];
  const steps: bigint[] = [];
  const factors: bigint[] = [];
  factorize(8051n, {
    onStart: (_n, c) => starts.push(c),
    onStep: (_xs, _xf, g) => steps.push(g),
    onFactor: (d) => factors.push(d),
  });
  assert.ok(starts.length >= 1);
  assert.ok(steps.length >= 1);
  assert.ok(factors.length >= 1);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.n=8051', () => {
  assert.equal(DEFAULT_INPUT.n, 8051n);
});
