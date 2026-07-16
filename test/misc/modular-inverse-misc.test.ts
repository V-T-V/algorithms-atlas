import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  modInverse,
  modInverseFermat,
  isInverse,
} from '../../src/algorithms/misc/modular-inverse-misc/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/modular-inverse-misc/trace.ts';

test('modInverse 基本逆元', () => {
  assert.equal(modInverse(3, 11), 4); // 3*4=12≡1 mod 11
  assert.equal(modInverse(7, 13), 2); // 7*2=14≡1 mod 13
  assert.equal(modInverse(10, 17), 12); // 10*12=120≡1 mod 17
});

test('modInverse 满足 a·inv ≡ 1 (mod m)', () => {
  for (const [a, m] of [
    [3, 11],
    [7, 13],
    [5, 97],
    [1234, 7919],
  ] as const) {
    const inv = modInverse(a, m);
    assert.ok(inv !== null, `a=${a},m=${m} 应有逆元`);
    assert.equal(isInverse(a, inv!, m), true);
  }
});

test('modInverse 不互质返回 null', () => {
  assert.equal(modInverse(2, 4), null); // GCD(2,4)=2
  assert.equal(modInverse(6, 9), null); // GCD(6,9)=3
  assert.equal(modInverse(4, 8), null);
});

test('modInverse a=0 返回 null', () => {
  assert.equal(modInverse(0, 7), null);
});

test('modInverse 负 a 归一化', () => {
  // -3 mod 11 = 8, 8 的逆元是 7（8*7=56≡1 mod 11）
  const inv = modInverse(-3, 11);
  assert.ok(inv !== null);
  assert.equal(isInverse(-3, inv!, 11), true);
});

test('modInverse 结果在 [0, m)', () => {
  for (const m of [7, 11, 13, 97]) {
    for (let a = 1; a < m; a++) {
      const inv = modInverse(a, m);
      if (inv !== null) assert.ok(inv >= 0 && inv < m, `inv=${inv}`);
    }
  }
});

test('modInverse 确定性', () => {
  assert.equal(modInverse(3, 11), modInverse(3, 11));
});

test('modInverse 非法输入抛错', () => {
  assert.throws(() => modInverse(3, 0));
  assert.throws(() => modInverse(3, -1));
  assert.throws(() => modInverse(1.5, 7));
});

test('modInverseFermat 与 modInverse 一致（素数模）', () => {
  for (const [a, m] of [
    [3, 11],
    [7, 13],
    [5, 97],
    [2, 1_000_000_007],
  ] as const) {
    const inv1 = modInverse(a, m);
    const inv2 = modInverseFermat(a, m);
    assert.ok(inv1 !== null);
    assert.equal(inv1, inv2, `a=${a},m=${m} 两种方法应一致`);
  }
});

test('modInverseFermat 不互质返回 null', () => {
  // 注意：Fermat 假设 m 素数；这里仅测 a=0 返回 null
  assert.equal(modInverseFermat(0, 7), null);
});

test('modInverse 双向性：inv 的逆元 == a（互质时）', () => {
  for (const [a, m] of [
    [3, 11],
    [7, 13],
  ] as const) {
    const inv = modInverse(a, m)!;
    const invInv = modInverse(inv, m)!;
    assert.equal(invInv % m, a % m);
  }
});

test('modInverse 钩子触发', () => {
  let extCalled = false;
  let result: number | null = null;
  modInverse(3, 11, {
    onExtGcd: () => (extCalled = true),
    onResult: (r) => (result = r),
  });
  assert.equal(extCalled, true);
  assert.equal(result, 4);
});

test('buildTrace 含 aux，末帧含逆元 x 或结论', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const hasInv = last.aux!.some((e) => e.label === '逆元 x' || e.label === '结论');
  assert.ok(hasInv, '末帧应含逆元或结论');
});
