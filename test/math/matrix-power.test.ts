import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matrixPower, matMul, identity } from '../../src/algorithms/math/matrix-power/impl.ts';

test('matrixPower 零次幂为单位矩阵', () => {
  const A = [
    [2, 1],
    [1, 3],
  ];
  assert.deepEqual(matrixPower(A, 0), identity(2));
});

test('matrixPower 一次幂为自身', () => {
  const A = [
    [1, 2],
    [3, 4],
  ];
  assert.deepEqual(matrixPower(A, 1), A);
});

test('matrixPower 斐波那契 [[1,1],[1,0]]^n', () => {
  const F = [
    [1, 1],
    [1, 0],
  ];
  // F^n = [[F(n+1), F(n)], [F(n), F(n-1)]]
  const r = matrixPower(F, 10);
  // F(11)=89, F(10)=55, F(9)=34
  assert.deepEqual(r, [
    [89, 55],
    [55, 34],
  ]);
});

test('matrixPower 与朴素连乘一致', () => {
  const A = [
    [1, 1],
    [0, 1],
  ];
  let naive = identity(2);
  for (let i = 0; i < 5; i++) naive = matMul(naive, A);
  assert.deepEqual(matrixPower(A, 5), naive);
});

test('matrixPower 取模', () => {
  const A = [
    [1, 1],
    [1, 0],
  ];
  // F(50) mod 1000：F(50)=12586269025 → 25；F(51) mod 1000 = 025+... 直接验 F(60) mod 1e9+7
  // F(60)=1548008755920 → mod 1e9+7 = 548008755920 mod 1e9+7
  const r60 = matrixPower(A, 60, 1000000007);
  // F(61)=2504730781961 → mod 1e9+7
  assert.equal(r60[0]![0], Number(2504730781961n % 1000000007n));
  assert.equal(r60[0]![1], Number(1548008755920n % 1000000007n));
  // 小指数：mod 路径与逐次相乘（mod）一致
  const naiveMod = identity(2);
  for (let i = 0; i < 8; i++) {
    const tmp = matMul(naiveMod, A, 1000);
    for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) naiveMod[x]![y] = tmp[x]![y]!;
  }
  assert.deepEqual(matrixPower(A, 8, 1000), naiveMod);
});

test('matrixPower 错误输入', () => {
  assert.throws(() => matrixPower([[1, 2]], 3), TypeError); // 非方阵
  assert.throws(() => matrixPower([[1]], -1), RangeError);
});
