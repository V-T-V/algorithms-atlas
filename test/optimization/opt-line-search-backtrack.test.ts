import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  backtrackLineSearch,
  steepestDescentBacktrack,
  type BacktrackHooks,
  type Vec,
} from '../../src/algorithms/optimization/opt-line-search-backtrack/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-line-search-backtrack/trace.ts';

const f = (x: Vec): number => (x[0]! - 3) ** 2 + (x[1]! + 1) ** 2;
const g = (x: Vec): Vec => [2 * (x[0]! - 3), 2 * (x[1]! + 1)];

test('opt-line-search-backtrack 满足 Armijo', () => {
  const x0: Vec = [0, 0];
  const grad = g(x0);
  const p: Vec = [-grad[0]!, -grad[1]!];
  const r = backtrackLineSearch(f, x0, f(x0), grad, p);
  assert.equal(r.accepted, true);
  assert.ok(r.fnew < f(x0));
});

test('opt-line-search-backtrack 二次问题单步取 α=1', () => {
  // f=||x−x*||²，海森 2I；沿 −g 方向，α=1 直接到极小（即 x*）
  const x0: Vec = [0, 0];
  const grad = g(x0);
  const p: Vec = [-grad[0]!, -grad[1]!];
  const r = backtrackLineSearch(f, x0, f(x0), grad, p, { alpha0: 1 });
  assert.equal(r.alpha, 1);
  assert.ok(Math.abs(r.fnew) < 1e-9);
});

test('opt-line-search-backtrack 步长随试探递减', () => {
  let prev = 1;
  let decreasing = false;
  const hooks: BacktrackHooks = {
    onTrial: (_i, alpha) => {
      if (alpha < prev) decreasing = true;
      prev = alpha;
    },
  };
  // 用一个曲率大的函数，强制回缩
  const fb = (x: Vec): number => (x[0]! - 1) ** 4;
  const gb = (x: Vec): Vec => [4 * (x[0]! - 1) ** 3];
  backtrackLineSearch(fb, [0], fb([0]), gb([0]), [-gb([0])![0]!], { alpha0: 1 }, hooks);
  assert.ok(decreasing);
});

test('opt-line-search-backtrack maxIter 限制', () => {
  const r = backtrackLineSearch(
    () => Infinity, // 永不满足
    [0],
    1,
    [1],
    [-1],
    { maxIter: 3 },
  );
  assert.equal(r.accepted, false);
  assert.equal(r.iterations, 3);
});

test('opt-line-search-backtrack steepestDescent 收敛', () => {
  const r = steepestDescentBacktrack(f, g, [0, 0], { maxIter: 200, tol: 1e-8 });
  assert.ok(Math.abs(r.x[0]! - 3) < 1e-2);
  assert.ok(Math.abs(r.x[1]! + 1) < 1e-2);
});

test('opt-line-search-backtrack 钩子', () => {
  let trials = 0;
  let results = 0;
  backtrackLineSearch(
    f,
    [0, 0],
    f([0, 0]),
    g([0, 0]),
    [-g([0, 0])![0]!, -g([0, 0])![1]!],
    {},
    { onTrial: () => trials++, onResult: () => results++ },
  );
  assert.ok(trials >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const a = last.aux!.find((e) => e.label === 'α*');
  assert.ok(a);
});
