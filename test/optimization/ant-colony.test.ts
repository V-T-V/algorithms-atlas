import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  antColony,
  dist,
  mulberry32,
  type ACOOptions,
  type AntColonyHooks,
  type City,
} from '../../src/algorithms/optimization/ant-colony/impl.ts';

const opts = (seed: number): ACOOptions => ({
  antCount: 8,
  iterations: 40,
  alpha: 1,
  beta: 3,
  rho: 0.1,
  Q: 100,
  initialPheromone: 1,
  rng: mulberry32(seed),
});

/** 计算一条回路（首尾相连）的实际长度。 */
function tourLength(tour: number[], cities: City[]): number {
  const n = tour.length;
  let len = 0;
  for (let i = 0; i < n; i++) {
    len += dist(cities[tour[i]!]!, cities[tour[(i + 1) % n]!]!);
  }
  return len;
}

test('ant-colony 边界情况', () => {
  const r0 = antColony([], opts(1));
  assert.equal(r0.bestLength, 0);
  assert.deepEqual(r0.bestTour, []);
  const r1 = antColony([{ x: 0, y: 0 }], opts(2));
  assert.equal(r1.bestLength, 0);
  assert.deepEqual(r1.bestTour, [0]);
});

test('ant-colony 结果回路合法（每个城市访问一次）', () => {
  const cities: City[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 0.5, y: 0.5 },
  ];
  const r = antColony(cities, opts(42));
  assert.equal(r.bestTour.length, cities.length);
  assert.deepEqual(
    [...r.bestTour].sort((a, b) => a - b),
    cities.map((_, i) => i),
  );
  // bestLength 应等于实际回路长度
  assert.ok(Math.abs(r.bestLength - tourLength(r.bestTour, cities)) < 1e-9);
});

test('ant-colony 找到已知最优（小规模正方形）', () => {
  // 4 个城市构成正方形，最优回路长度 = 4（边长 1）
  const cities: City[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
  const r = antColony(cities, opts(7));
  assert.ok(Math.abs(r.bestLength - 4) < 1e-6, `bestLength ${r.bestLength} 应为 4`);
});

test('ant-colony 固定种子可复现', () => {
  const cities: City[] = [
    { x: 0.1, y: 0.2 },
    { x: 0.8, y: 0.1 },
    { x: 0.9, y: 0.9 },
    { x: 0.2, y: 0.8 },
    { x: 0.5, y: 0.5 },
  ];
  const a = antColony(cities, opts(123));
  const b = antColony(cities, opts(123));
  assert.equal(a.bestLength, b.bestLength);
  assert.deepEqual(a.bestTour, b.bestTour);
});

test('ant-colony 钩子被调用', () => {
  let iters = 0;
  let finish = 0;
  const hooks: AntColonyHooks = {
    onIteration: () => iters++,
    onFinish: () => finish++,
  };
  antColony(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
    opts(5),
    hooks,
  );
  assert.ok(iters >= 40, `应触发 40 次 onIteration，实际 ${iters}`);
  assert.equal(finish, 1);
});
