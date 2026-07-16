import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crt } from '../../src/algorithms/math/crt/impl.ts';

test('crt 经典物不知数：x ≡ 2 mod 3, 3 mod 5, 2 mod 7 → 23', () => {
  const { value, modulus } = crt([2, 3, 2], [3, 5, 7]);
  assert.equal(value, 23n);
  assert.equal(modulus, 105n);
});

test('crt 满足所有同余式', () => {
  const cases: Array<[number[], number[]]> = [
    [
      [2, 3, 2],
      [3, 5, 7],
    ],
    [
      [1, 4, 9],
      [5, 7, 11],
    ],
    [
      [0, 0, 0],
      [2, 3, 5],
    ],
    [
      [1, 2, 3, 4],
      [5, 7, 9, 11],
    ],
  ];
  for (const [rems, mods] of cases) {
    const { value } = crt(rems, mods);
    for (let i = 0; i < rems.length; i++) {
      assert.equal(
        value % BigInt(mods[i]!),
        BigInt(rems[i]!),
        `${rems} mod ${mods} 不满足第 ${i} 项`,
      );
    }
  }
});

test('crt 互素模数的 modulus 等于乘积', () => {
  const { modulus } = crt([1, 2, 3], [3, 5, 7]);
  assert.equal(modulus, 3n * 5n * 7n);
});

test('crt 边界：单一同余式', () => {
  const { value, modulus } = crt([5], [7]);
  assert.equal(value, 5n);
  assert.equal(modulus, 7n);
});

test('crt 边界：空输入返回 {0, 1}', () => {
  const { value, modulus } = crt([], []);
  assert.equal(value, 0n);
  assert.equal(modulus, 1n);
});

test('crt 不互素但有解（lcm 模数）', () => {
  // x ≡ 3 mod 4, x ≡ 1 mod 6 → gcd(4,6)=2, (1-3)%2==0 有解，lcm=12
  // 解：x ≡ 9 (mod 12)（9 mod 4 = 1 ≠3... 重算：满足 x mod4=3 且 x mod6=1 的是 x=9）
  const { value, modulus } = crt([3, 1], [4, 6]);
  assert.equal(value % 4n, 3n);
  assert.equal(value % 6n, 1n);
  assert.equal(modulus, 12n); // lcm(4,6)
});

test('crt 不互素且无解时抛错', () => {
  // x ≡ 1 mod 4 与 x ≡ 0 mod 6：gcd(4,6)=2 但 (0-1)=-1 不被 2 整除 → 无解
  assert.throws(() => crt([1, 0], [4, 6]), RangeError);
  assert.throws(() => crt([2, 3], [4, 8]), RangeError);
});

test('crt 大数正确', () => {
  const mods = [999999937n, 999999929n, 999999893n]; // 三个大素数
  const rems = [123456789n, 987654321n, 555555555n];
  const { value, modulus } = crt(rems, mods);
  assert.equal(modulus, mods[0]! * mods[1]! * mods[2]!);
  for (let i = 0; i < mods.length; i++) {
    assert.equal(value % mods[i]!, rems[i]!);
  }
});

test('crt 长度不匹配抛错', () => {
  assert.throws(() => crt([1, 2], [3]), RangeError);
});

test('crt 钩子被调用', () => {
  let merges = 0;
  let gcds = 0;
  let done = 0;
  crt([2, 3, 2], [3, 5, 7], {
    onMerge: () => merges++,
    onGcd: () => gcds++,
    onDone: () => done++,
  });
  assert.equal(merges, 2, '三个同余式应合并 2 次');
  assert.equal(gcds, 2, '每次合并一次 gcd');
  assert.equal(done, 1, 'onDone 恰好一次');
});
