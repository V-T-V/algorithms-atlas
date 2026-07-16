import { test } from 'node:test';
import assert from 'node:assert/strict';
import { duSieve } from '../../src/algorithms/math/du-sieve/impl.ts';
import { phiSieve } from '../../src/algorithms/math/phi-sieve/impl.ts';
import { mobiusSieve } from '../../src/algorithms/math/mobius-inversion/impl.ts';

/** 暴力 Σμ、Σφ（用于小数据交叉校验）。 */
function brute(n: number): { sumMu: bigint; sumPhi: bigint } {
  const mu = mobiusSieve(n);
  const phi = phiSieve(n);
  let sm = 0;
  let sp = 0;
  for (let i = 1; i <= n; i++) {
    sm += mu[i]!;
    sp += phi[i]!;
  }
  return { sumMu: BigInt(sm), sumPhi: BigInt(sp) };
}

test('du-sieve 边界', () => {
  assert.deepEqual(duSieve(0), { sumMu: 0n, sumPhi: 0n });
  assert.deepEqual(duSieve(1), { sumMu: 1n, sumPhi: 1n });
});

test('du-sieve 小数据与暴力一致', () => {
  for (const n of [2, 5, 10, 20, 50, 100]) {
    const got = duSieve(n);
    const exp = brute(n);
    assert.equal(got.sumMu, exp.sumMu, `Σμ(${n})`);
    assert.equal(got.sumPhi, exp.sumPhi, `Σφ(${n})`);
  }
});

test('du-sieve 大数据仍正确（n=10^6）', () => {
  // 强制走「预筛 < n」的递归路径
  const { sumPhi, sumMu } = duSieve(1_000_000);
  // Σ_{i=1}^{n} φ(i) 的渐近为 3n²/π²；这里只校验 Σμ 在小量级上的符号交替大致正确
  // 并校验 sumPhi 在合理量级 (约 3*10^12/π² ≈ 3.04*10^11)
  assert.ok(sumPhi > 3n * 10n ** 11n, `Σφ(10^6) 应约 3·10^11`);
  assert.ok(sumPhi < 4n * 10n ** 11n, `Σφ(10^6) 应约 3·10^11`);
  // |Σμ(n)| <= sqrt(n) (Mertens 上界弱形式)
  assert.ok(sumMu < 0n ? -sumMu < 2000n : sumMu < 2000n, `|Σμ(10^6)| 应很小`);
});

test('du-sieve 钩子被调用', () => {
  let pre = 0;
  let blocks = 0;
  let rec = 0;
  let done = 0;
  duSieve(100, {
    onPreSieve: () => pre++,
    onBlock: () => blocks++,
    onRecurse: () => rec++,
    onDone: () => done++,
  });
  assert.equal(pre, 1);
  assert.ok(blocks > 0, '应触发数论分块');
  assert.ok(rec >= 0);
  assert.equal(done, 1);
});

test('du-sieve 拒绝非整数 / 负数', () => {
  assert.throws(() => duSieve(-1), RangeError);
  assert.throws(() => duSieve(3.7), RangeError);
});
