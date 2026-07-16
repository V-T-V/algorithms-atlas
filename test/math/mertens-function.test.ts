import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mertens, mobiusSieve } from '../../src/algorithms/math/mertens-function/impl.ts';

test('mobiusSieve 基本值', () => {
  const mu = mobiusSieve(20);
  // μ 对照：1:1, 2:-1, 3:-1, 4:0, 5:-1, 6:1, 7:-1, 8:0, 9:0, 10:1, 11:-1, 12:0
  assert.deepEqual(mu.slice(0, 13), [0, 1, -1, -1, 0, -1, 1, -1, 0, 0, 1, -1, 0]);
});

test('mertens M(n) 已知序列', () => {
  // M(1..20): 1,0,-1,-1,-2,-1,-2,-2,-2,-1,-2,-2,-3,-2,-1,-1,-2,-2,-3,-3
  const { M } = mertens(20);
  assert.deepEqual(
    M.slice(1, 21),
    [1, 0, -1, -1, -2, -1, -2, -2, -2, -1, -2, -2, -3, -2, -1, -1, -2, -2, -3, -3],
  );
});

test('mertens μ 与定义一致（50）', () => {
  const { mu } = mertens(50);
  for (let k = 1; k <= 50; k++) {
    // 求 μ 的朴素定义
    let x = k;
    let sign = 1;
    let bad = false;
    for (let p = 2; p * p <= x; p++) {
      if (x % p === 0) {
        x /= p;
        if (x % p === 0) {
          bad = true;
          break;
        }
        sign = -sign;
      }
    }
    if (x > 1) sign = -sign;
    const expected = bad ? 0 : sign;
    // 用 + 规范化 -0 与 +0
    assert.equal(mu[k]! + 0, expected + 0, `μ(${k})`);
  }
});

test('mertens 边界', () => {
  assert.deepEqual(mertens(0).M, [0]);
  assert.deepEqual(mertens(1).M, [0, 1]);
});
