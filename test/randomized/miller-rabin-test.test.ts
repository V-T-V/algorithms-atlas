// Miller-Rabin 随机化素性测试 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  millerRabin,
  modPow,
  makeRng,
  DETERMINISTIC_BASES,
} from '../../src/algorithms/randomized/miller-rabin-test/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/miller-rabin-test/trace.ts';

test('modPow 基础', () => {
  assert.equal(modPow(2n, 10n, 1000n), 24n); // 1024 mod 1000
  assert.equal(modPow(3n, 5n, 7n), 5n); // 243 mod 7 = 5
  assert.equal(modPow(7n, 0n, 13n), 1n);
});

test('小素数判定', () => {
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 97n, 101n]) {
    assert.equal(millerRabin(p, 5, makeRng(42), true), true, `${p} 应为素数`);
  }
});

test('小合数判定', () => {
  for (const c of [4n, 6n, 9n, 15n, 21n, 100n, 121n]) {
    assert.equal(millerRabin(c, 5, makeRng(42), true), false, `${c} 应为合数`);
  }
});

test('边界：n<2 返回 false', () => {
  assert.equal(millerRabin(0n, 5, makeRng(42), true), false);
  assert.equal(millerRabin(1n, 5, makeRng(42), true), false);
});

test('Carmichael 数 561 是合数（确定性基组识破）', () => {
  // 561 = 3·11·17，费马伪素数，但 Miller-Rabin 能识破
  assert.equal(millerRabin(561n, 5, makeRng(42), true), false);
});

test('Carmichael 数 1105、1729 是合数', () => {
  assert.equal(millerRabin(1105n, 5, makeRng(42), true), false);
  assert.equal(millerRabin(1729n, 5, makeRng(42), true), false);
});

test('随机化模式对小素数正确', () => {
  for (let seed = 1; seed <= 10; seed++) {
    assert.equal(millerRabin(97n, 10, makeRng(seed), false), true);
    assert.equal(millerRabin(100n, 10, makeRng(seed), false), false);
  }
});

test('确定性基组：大素数 2^61−1', () => {
  // 2^61 − 1 是梅森素数
  const m = (1n << 61n) - 1n;
  assert.equal(millerRabin(m, 5, makeRng(42), true), true);
});

test('确定性基组：大合数 2^60', () => {
  assert.equal(millerRabin(1n << 60n, 5, makeRng(42), true), false);
});

test('确定性基组完整', () => {
  assert.deepEqual(DETERMINISTIC_BASES, [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]);
});

test('钩子完整触发', () => {
  let decomposed = false;
  const rounds: boolean[] = [];
  const result: { v: { p: boolean; r: number } | null } = { v: null };
  millerRabin(221n, 5, makeRng(42), true, {
    onDecompose: () => (decomposed = true),
    onRound: (_r, passed) => rounds.push(passed),
    onResult: (p, r) => (result.v = { p, r }),
  });
  assert.ok(decomposed);
  assert.ok(rounds.length >= 1);
  assert.ok(result.v !== null);
  assert.equal(result.v!.p, false); // 221=13·17 合数
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.n=561 是 Carmichael 数', () => {
  assert.equal(DEFAULT_INPUT.n, 561n);
});
