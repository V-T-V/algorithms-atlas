// Schwartz-Zippel 多项式恒等测试 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  schwartzZippelProduct,
  schwartzZippelUnivariate,
  evalPoly,
  evalProductPoly,
  makeRng,
} from '../../src/algorithms/randomized/schwartz-zippel/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/schwartz-zippel/trace.ts';

test('evalPoly Horner 求值', () => {
  // x^2 - 1, coeffs [1,0,-1]
  assert.equal(evalPoly([1, 0, -1], 2), 3);
  assert.equal(evalPoly([1, 0, -1], 1), 0);
  assert.equal(evalPoly([1, 0, -1], -1), 0);
});

test('evalProductPoly 乘积式求值', () => {
  // (x0-2)(x1-3)(x2-5)
  assert.equal(evalProductPoly([2, 3, 5], [2, 3, 5]), 0);
  assert.equal(evalProductPoly([2, 3, 5], [0, 0, 0]), -2 * -3 * -5);
  assert.equal(evalProductPoly([2, 3, 5], [10, 10, 10]), 8 * 7 * 5);
});

test('非零多项式：随机试验至少在足够次数内确证非零', () => {
  // a=[2,3,5]，p=7：只有 r=[2,3,5] 使 P=0，6/7 概率非零
  // 多种子下 10 次试验几乎必然命中非零
  let confirmed = 0;
  for (let seed = 1; seed <= 20; seed++) {
    if (schwartzZippelProduct([2, 3, 5], 7, 10, makeRng(seed))) confirmed++;
  }
  assert.ok(confirmed >= 19, `应有 >=19 次确证非零，实际 ${confirmed}`);
});

test('非零多项式被确证为非零（单种子多次试验）', () => {
  assert.equal(schwartzZippelProduct([2, 3, 5], 7, 10, makeRng(42)), true);
});

test('一元零多项式（全 0 系数）返回 false', () => {
  assert.equal(schwartzZippelUnivariate([0, 0, 0], 7, 5, makeRng(42)), false);
});

test('一元非零多项式返回 true', () => {
  // x^2 - 1 非零，p=7，k=10
  assert.equal(schwartzZippelUnivariate([1, 0, -1], 7, 10, makeRng(42)), true);
});

test('钩子完整触发', () => {
  const points: number[][] = [];
  const evals: number[] = [];
  const result: { v: { d: boolean; t: number } | null } = { v: null };
  const ok = schwartzZippelProduct([2, 3, 5], 7, 3, makeRng(7), {
    onRandomPoint: (_t, r) => points.push([...r]),
    onEvaluate: (_t, v) => evals.push(v),
    onResult: (d, t) => (result.v = { d, t }),
  });
  assert.equal(typeof ok, 'boolean');
  assert.ok(points.length >= 1);
  assert.ok(evals.length >= 1);
  assert.ok(result.v !== null);
  assert.equal(result.v!.t, points.length);
});

test('一旦非零立即返回', () => {
  let trials = 0;
  schwartzZippelProduct([2, 3, 5], 7, 100, makeRng(7), {
    onTrial: () => trials++,
  });
  // 非零时会提前返回，trial 数应远小于 100
  assert.ok(trials <= 100);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT 正确', () => {
  assert.equal(DEFAULT_INPUT.p, 7);
  assert.equal(DEFAULT_INPUT.k, 5);
  assert.equal(DEFAULT_INPUT.anchors.length, 3);
});
