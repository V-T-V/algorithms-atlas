import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  inverseModFermat,
  inverseModExtGcd,
  inverseMod,
  extGcd,
} from '../../src/algorithms/math/inverse-mod/impl.ts';

test('费马小定理求逆元（核心性质：a · inv ≡ 1）', () => {
  // 对若干素数 m，验证 a · inv mod m == 1
  for (const [a, m] of [
    [3, 11],
    [7, 13],
    [5, 17],
    [10, 17],
    [2, 1000000007],
    [123456, 1000000007],
  ] as [number, number][]) {
    const inv = inverseModFermat(a, m);
    assert.equal((BigInt(a) * inv) % BigInt(m), 1n, `${a}^(-1) mod ${m}`);
  }
});

test('费马小定理已知值', () => {
  // 3^(-1) mod 11 = 4 （3·4=12≡1）
  assert.equal(inverseModFermat(3, 11), 4n);
  // 7^(-1) mod 13 = 2 （7·2=14≡1）
  assert.equal(inverseModFermat(7, 13), 2n);
  // 1 的逆元是 1
  assert.equal(inverseModFermat(1, 7), 1n);
});

test('扩展欧几里得求逆元', () => {
  // 对任意互素的 a, m
  for (const [a, m] of [
    [3, 11],
    [7, 13],
    [5, 17],
    [10, 23],
    [12345, 99991], // 99991 是素数
  ] as [number, number][]) {
    const inv = inverseModExtGcd(a, m);
    assert.equal((BigInt(a) * inv) % BigInt(m), 1n, `${a}^(-1) mod ${m}`);
  }
});

test('费马与扩展欧几里得结果一致', () => {
  for (const [a, m] of [
    [3, 11],
    [7, 13],
    [5, 1000000007],
    [999, 1000000007],
  ] as [number, number][]) {
    assert.equal(inverseModFermat(a, m), inverseModExtGcd(a, m), `${a}^(-1) mod ${m}`);
  }
});

test('逆元在 [0, m) 内', () => {
  for (const [a, m] of [
    [3, 11],
    [10, 17],
    [-3, 11], // 负数输入
  ] as [number, number][]) {
    const inv = inverseMod(a, m, {}, 'extgcd');
    assert.ok(inv >= 0n && inv < BigInt(m), `inv=${inv} 应在 [0, ${m})`);
  }
});

test('不互素时扩展欧几里得抛错', () => {
  // gcd(2, 4) = 2 ≠ 1，无逆元
  assert.throws(() => inverseModExtGcd(2, 4), /no inverse/);
  assert.throws(() => inverseModExtGcd(6, 9), /no inverse/);
});

test('extGcd 返回 gcd 与 Bézout 系数', () => {
  // 35·1 + 15·(-2) = 5 = gcd(35,15)
  const r = extGcd(35, 15);
  assert.equal(r.g, 5);
  assert.equal(35 * r.x + 15 * r.y, 5);
  // 240·1 + 46·(-5) = 10 = gcd(240,46)
  const r2 = extGcd(240, 46);
  assert.equal(r2.g, 2);
  assert.equal(240 * r2.x + 46 * r2.y, 2);
});

test('inverseMod 入口可切换方法', () => {
  assert.equal(inverseMod(3, 11, {}, 'fermat'), 4n);
  assert.equal(inverseMod(3, 11, {}, 'extgcd'), 4n);
});

test('钩子被调用', () => {
  let square = 0;
  let multiply = 0;
  let done = 0;
  inverseModFermat(3, 11, {
    onSquare: () => square++,
    onMultiply: () => multiply++,
    onDone: () => done++,
  });
  assert.ok(square >= 1, '应触发 onSquare');
  assert.ok(multiply >= 1, '应触发 onMultiply');
  assert.equal(done, 1);

  let steps = 0;
  let extDone = 0;
  inverseModExtGcd(7, 13, {
    onExtGcdStep: () => steps++,
    onExtGcdDone: () => extDone++,
  });
  assert.ok(steps >= 1, '应至少一轮扩展欧几里得');
  assert.equal(extDone, 1);
});

test('buildTrace 产生帧（两种方法）', async () => {
  const { buildTrace } = await import('../../src/algorithms/math/inverse-mod/trace.ts');
  const f1 = buildTrace({ a: 3, m: 11, method: 'fermat' });
  assert.ok(f1.length > 2);
  assert.ok(f1[f1.length - 1]!.note?.zh);
  const f2 = buildTrace({ a: 7, m: 13, method: 'extgcd' });
  assert.ok(f2.length > 2);
});
