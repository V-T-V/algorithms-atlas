import { test } from 'node:test';
import assert from 'node:assert/strict';
import { millerRabin } from '../../src/algorithms/math/miller-rabin/impl.ts';

test('miller-rabin 已知素数判为素数', () => {
  for (const p of [2, 3, 5, 7, 11, 13, 97, 101, 1009, 7919, 104729, 1299709]) {
    assert.equal(millerRabin(p), true, `${p} 应为素数`);
  }
});

test('miller-rabin 已知合数判为合数', () => {
  for (const c of [4, 6, 9, 15, 21, 25, 100, 561, 1001, 9999]) {
    assert.equal(millerRabin(c), false, `${c} 应为合数`);
  }
});

test('miller-rabin 边界', () => {
  assert.equal(millerRabin(0), false);
  assert.equal(millerRabin(1), false);
  assert.equal(millerRabin(2), true);
  assert.equal(millerRabin(3), true);
});

test('miller-rabin 识别卡迈克尔数（伪素数陷阱）', () => {
  // 卡迈克尔数对 Fermat 测试有欺骗性，但 Miller-Rabin 能正确判合数
  assert.equal(millerRabin(561), false); // 561 = 3·11·17，最小卡迈克尔数
  assert.equal(millerRabin(1105), false);
  assert.equal(millerRabin(1729), false);
  assert.equal(millerRabin(2465), false);
});

test('miller-rabin 与朴素试除法一致', () => {
  const isPrimeNaive = (n: number): boolean => {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
    return true;
  };
  for (let n = 0; n <= 5000; n++) {
    assert.equal(millerRabin(n), isPrimeNaive(n), `mismatch at ${n}`);
  }
});

test('miller-rabin 大素数正确', () => {
  // 2147483647 = 梅森素数 M31
  assert.equal(millerRabin(2147483647), true);
  assert.equal(millerRabin(2147483646), false);
});

test('miller-rabin 钩子被调用', () => {
  let decompose = 0;
  let witnesses = 0;
  let witnessDone = 0;
  let done = 0;
  // 10403 = 101·103：无小素因子，必须走到分解与见证阶段
  millerRabin(10403, 12, {
    onDecompose: () => decompose++,
    onWitness: () => witnesses++,
    onWitnessDone: () => witnessDone++,
    onDone: () => done++,
  });
  assert.equal(decompose, 1, '分解仅一次');
  assert.ok(witnesses >= 1, '至少一个见证基');
  assert.equal(witnessDone, witnesses, '每个见证基都有 done');
  assert.equal(done, 1, 'onDone 恰好一次');
});

test('miller-rabin 钩子在素数上跑到全部轮数', () => {
  let witnesses = 0;
  millerRabin(97, 12, { onWitness: () => witnesses++ });
  assert.equal(witnesses, 12, '素数不被证伪，应跑满 12 轮');
});
