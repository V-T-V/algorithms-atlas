import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pso, mulberry32, type PsoOptions } from '../../src/algorithms/optimization/pso/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/optimization/pso/trace.ts';

/** sphere: f(x) = Σ xᵢ²，最优解全 0，值 0。 */
function sphere(x: number[]): number {
  return x.reduce((s, v) => s + v * v, 0);
}

function defaultOpts(seed: number): PsoOptions {
  return {
    swarmSize: 20,
    maxIterations: 100,
    inertia: 0.7,
    cognitive: 1.5,
    social: 1.5,
    bounds: { lo: -10, hi: 10 },
    tolerance: 1e-8,
    rng: mulberry32(seed),
  };
}

test('pso 最小化 sphere 收敛到近 (0,0)', () => {
  const r = pso(sphere, 2, defaultOpts(42));
  assert.ok(r.bestFitness < 1e-3, `最优值应很小，实际 ${r.bestFitness}`);
  assert.ok(Math.abs(r.bestPosition[0]!) < 0.05, `x 接近 0，实际 ${r.bestPosition[0]}`);
  assert.ok(Math.abs(r.bestPosition[1]!) < 0.05, `y 接近 0，实际 ${r.bestPosition[1]}`);
});

test('pso 最优值非负', () => {
  const r = pso(sphere, 3, defaultOpts(7));
  assert.ok(r.bestFitness >= 0);
});

test('pso 同种子同结果（可复现）', () => {
  const a = pso(sphere, 2, defaultOpts(123));
  const b = pso(sphere, 2, defaultOpts(123));
  assert.deepEqual(a.bestPosition, b.bestPosition);
  assert.equal(a.bestFitness, b.bestFitness);
  assert.equal(a.iterations, b.iterations);
});

test('pso 不同种子结果可能不同', () => {
  const a = pso(sphere, 2, defaultOpts(1));
  const b = pso(sphere, 2, defaultOpts(999));
  // 不一定不同，但大概率；这里只校验二者都是有效解
  assert.ok(a.bestFitness < 1e-3);
  assert.ok(b.bestFitness < 1e-3);
});

test('pso 迭代轮数不超过上限', () => {
  const r = pso(sphere, 2, { ...defaultOpts(5), maxIterations: 20 });
  assert.ok(r.iterations <= 20);
});

test('pso 钩子被调用', () => {
  let iters = 0;
  let velUpdates = 0;
  let posUpdates = 0;
  let gBestUpdates = 0;
  let results = 0;
  pso(sphere, 2, defaultOpts(42), {
    onIteration: () => iters++,
    onUpdateVelocity: () => velUpdates++,
    onUpdatePosition: () => posUpdates++,
    onGlobalBest: () => gBestUpdates++,
    onResult: () => results++,
  });
  assert.ok(iters >= 1);
  // 每轮每粒子更新一次速度/位置
  assert.equal(velUpdates, iters * 20);
  assert.equal(posUpdates, iters * 20);
  assert.ok(gBestUpdates >= 1); // 至少初始 gBest
  assert.equal(results, 1);
});

test('mulberry32 同种子同序列', () => {
  const a = mulberry32(55);
  const b = mulberry32(55);
  const sa = Array.from({ length: 5 }, a);
  const sb = Array.from({ length: 5 }, b);
  assert.deepEqual(sa, sb);
  for (const v of sa) assert.ok(v >= 0 && v < 1);
});

test('pso 边界约束：粒子位置不越界', () => {
  const opts = { ...defaultOpts(3), bounds: { lo: -2, hi: 2 } };
  let violated = false;
  pso(sphere, 2, opts, {
    onUpdatePosition: (_i, pos) => {
      if (pos[0]! < -2 || pos[0]! > 2 || pos[1]! < -2 || pos[1]! > 2) violated = true;
    },
  });
  assert.ok(!violated, '粒子位置应在边界内');
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.graph, '每帧应有 graph');
  // 终帧 aux 含最优适应度
  const last = frames[frames.length - 1]!;
  const fit = last.aux!.find((e) => e.label === '最优适应度');
  assert.ok(fit);
});

test('buildTrace 收敛到小值', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const fit = last.aux!.find((e) => e.label === '最优适应度')!;
  const value = parseFloat(fit.value);
  assert.ok(value < 1e-2, `终帧最优值应很小，实际 ${fit.value}`);
});
