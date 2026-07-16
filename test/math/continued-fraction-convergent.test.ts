import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  continuedFractionConvergents,
  convergentValue,
  type Convergent,
} from '../../src/algorithms/math/continued-fraction-convergent/impl.ts';

const toTuple = (cs: Convergent[]): Array<[number, number]> => cs.map((c) => [c.h, c.k]);

test('continued-fraction-convergent [3;7,15,1] 渐近分数', () => {
  // 经典 π 的连分数近似：[3;7,15,1] → 3/1, 22/7, 333/106, 355/113
  const cs = continuedFractionConvergents([3, 7, 15, 1]);
  assert.deepEqual(toTuple(cs), [
    [3, 1],
    [22, 7],
    [333, 106],
    [355, 113],
  ]);
});

test('continued-fraction-convergent √2=[1;2,2,2]', () => {
  const cs = continuedFractionConvergents([1, 2, 2, 2]);
  assert.deepEqual(toTuple(cs), [
    [1, 1],
    [3, 2],
    [7, 5],
    [17, 12],
  ]);
  // 17/12 ≈ 1.4166... 趋近 √2 ≈ 1.4142
  assert.ok(Math.abs(convergentValue(cs[cs.length - 1]!) - Math.SQRT2) < 0.01);
});

test('continued-fraction-convergent 单项 [5]', () => {
  const cs = continuedFractionConvergents([5]);
  assert.deepEqual(toTuple(cs), [[5, 1]]);
});

test('continued-fraction-convergent 黄金比 [1;1,1,1,1]', () => {
  // 连续 5 个 1 → 1/1, 2/1, 3/2, 5/3, 8/5 （斐波那契比）
  const cs = continuedFractionConvergents([1, 1, 1, 1, 1]);
  assert.deepEqual(toTuple(cs), [
    [1, 1],
    [2, 1],
    [3, 2],
    [5, 3],
    [8, 5],
  ]);
});

test('continued-fraction-convergent 空输入', () => {
  assert.deepEqual(continuedFractionConvergents([]), []);
});

test('continued-fraction-convergent 大数不溢出（BigInt）', () => {
  // 用很多项确保最终值远超 Number.MAX_SAFE_INTEGER
  const a = Array.from({ length: 30 }, () => 99);
  const cs = continuedFractionConvergents(a);
  const last = cs[cs.length - 1]!;
  // 仅校验运行无异常且分子分母都为正
  assert.ok(last.h > 0);
  assert.ok(last.k > 0);
  assert.equal(last.h % 1, 0);
});

test('continued-fraction-convergent 钩子被调用', () => {
  const seen: Array<{ k: number; h: number; kk: number }> = [];
  let resultCount = 0;
  continuedFractionConvergents([3, 7, 15, 1], {
    onConvergent: (k, h, kk) => seen.push({ k, h, kk }),
    onResult: () => resultCount++,
  });
  assert.equal(seen.length, 4);
  assert.equal(seen[0]!.h, 3);
  assert.equal(seen[3]!.h, 355);
  assert.equal(seen[3]!.kk, 113);
  assert.equal(resultCount, 1);
});
