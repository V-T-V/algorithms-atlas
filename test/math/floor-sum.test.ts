import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floorSum } from '../../src/algorithms/math/floor-sum/impl.ts';

test('floorSum 与暴力一致', () => {
  const cases: Array<[number, number, number, number]> = [
    [4, 10, 6, 3],
    [10, 7, 3, 2],
    [5, 3, 1, 0],
    [100, 1000, 4, 6],
    [6, 5, 3, 1],
    [3, 1, 0, 0],
    [1000, 13, 7, 5],
    [50, 3, 2, 1],
    [10000, 998244353, 123456, 7890],
  ];
  for (const [n, m, a, b] of cases) {
    let brute = 0n;
    for (let i = 0; i < n; i++) brute += BigInt(Math.floor((a * i + b) / m));
    assert.equal(floorSum(n, m, a, b), brute, `floorSum(${n},${m},${a},${b})`);
  }
});

test('floorSum 边界', () => {
  assert.equal(floorSum(0, 5, 3, 1), 0n); // n=0 空和
  assert.equal(floorSum(1, 5, 3, 1), 0n); // i=0: floor(1/5)=0
  assert.equal(floorSum(5, 1, 0, 0), 0n); // 全 0
});

test('floorSum 错误输入', () => {
  assert.throws(() => floorSum(-1, 5, 1, 0), RangeError);
  assert.throws(() => floorSum(5, 0, 1, 0), RangeError);
  assert.throws(() => floorSum(5, 5, -1, 0), RangeError);
});

test('floorSum 钩子被调用', () => {
  let reduces = 0;
  let results = 0;
  floorSum(1000, 13, 7, 5, {
    onReduce: () => reduces++,
    onResult: () => results++,
  });
  assert.ok(reduces >= 1, '应至少一次递归');
  assert.equal(results, 1, 'onResult 恰好一次');
});
