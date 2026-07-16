import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCombTable,
  comb,
  perm,
  pascalTriangle,
  combBig,
  powMod,
  COMB_MOD,
} from '../../src/algorithms/math/combinatorics/impl.ts';

test('组合数基本值', () => {
  const t = buildCombTable(20);
  assert.equal(comb(t, 0, 0), 1n);
  assert.equal(comb(t, 5, 0), 1n);
  assert.equal(comb(t, 5, 5), 1n);
  assert.equal(comb(t, 5, 2), 10n);
  assert.equal(comb(t, 6, 3), 20n);
  assert.equal(comb(t, 10, 3), 120n);
  assert.equal(comb(t, 10, 7), 120n); // C(n,k)=C(n,n-k)
});

test('组合数边界', () => {
  const t = buildCombTable(10);
  assert.equal(comb(t, 5, -1), 0n);
  assert.equal(comb(t, 5, 6), 0n);
  assert.equal(comb(t, -1, 0), 0n);
});

test('排列数', () => {
  const t = buildCombTable(10);
  assert.equal(perm(t, 5, 0), 1n);
  assert.equal(perm(t, 5, 1), 5n);
  assert.equal(perm(t, 5, 5), 120n); // 5!
  assert.equal(perm(t, 10, 3), 720n); // 10·9·8
});

test('组合数与 combBig（精确整数）一致（小值不溢出 mod）', () => {
  const t = buildCombTable(50);
  // 对小值，C(n,k) 本身 < p，故 mod 前后相等
  for (const [n, k] of [
    [10, 3],
    [20, 10],
    [30, 5],
    [7, 0],
    [7, 7],
  ] as [number, number][]) {
    assert.equal(comb(t, n, k), combBig(n, k), `C(${n},${k})`);
  }
  // C(50,25) > p，必须取模比较
  assert.equal(comb(t, 50, 25), combBig(50, 25) % COMB_MOD, `C(50,25) mod p`);
});

test('组合数取模正确（大值）', () => {
  // C(100, 50) mod 1e9+7 已知值
  // 计算 C(100,50) mod 1e9+7：用 combBig 取模作为参考
  const expected = combBig(100, 50) % COMB_MOD;
  const t = buildCombTable(100);
  assert.equal(comb(t, 100, 50), expected);
});

test('combBig 工具', () => {
  assert.equal(combBig(0, 0), 1n);
  assert.equal(combBig(5, 2), 10n);
  assert.equal(combBig(10, 3), 120n);
  assert.equal(combBig(100, 50), 100891344545564193334812497256n); // 已知精确值
});

test('杨辉三角性质', () => {
  const tri = pascalTriangle(6);
  assert.equal(tri.length, 6);
  // 第 0 行
  assert.deepEqual(tri[0], [1n]);
  // 第 5 行 = 1 5 10 10 5 1
  assert.deepEqual(tri[5], [1n, 5n, 10n, 10n, 5n, 1n]);
  // 每行首末为 1
  for (const row of tri) {
    assert.equal(row[0], 1n);
    assert.equal(row[row.length - 1], 1n);
  }
  // 行和 = 2^n
  for (let n = 0; n < 6; n++) {
    const sum = tri[n]!.reduce((a, b) => a + b, 0n);
    assert.equal(sum, 2n ** BigInt(n));
  }
});

test('杨辉三角与 comb 一致（mod p）', () => {
  const tri = pascalTriangle(15);
  const t = buildCombTable(15);
  for (let n = 0; n < 15; n++) {
    for (let k = 0; k <= n; k++) {
      assert.equal(comb(t, n, k), tri[n]![k]! % COMB_MOD, `C(${n},${k})`);
    }
  }
});

test('powMod 工具', () => {
  assert.equal(powMod(2n, 10n, 1000n), 24n); // 1024 mod 1000
  assert.equal(powMod(3n, 0n, 7n), 1n);
  // 费马小定理：2^(p-1) ≡ 1 mod p
  assert.equal(powMod(2n, COMB_MOD - 1n, COMB_MOD), 1n);
});

test('combinatorics 钩子被调用', () => {
  let fact = 0;
  let invFact = 0;
  let query = 0;
  buildCombTable(5, COMB_MOD, {
    onFact: () => fact++,
    onInvFact: () => invFact++,
  });
  assert.equal(fact, 6); // 0..5
  assert.equal(invFact, 6);
  const t = buildCombTable(10);
  comb(t, 5, 2, { onQuery: () => query++ });
  assert.equal(query, 1);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/math/combinatorics/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
});
