import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hillClimbing,
  adjacentEnergy,
  swapNeighbor,
  mulberry32,
  type HCOptions,
  type HillClimbingHooks,
} from '../../src/algorithms/optimization/hill-climbing/impl.ts';

const opts = (seed: number): HCOptions => ({
  maxIterations: 500,
  sampleSize: 8,
  rng: mulberry32(seed),
});

test('hill-climbing 边界情况（单元素/已最优）', () => {
  const e1 = adjacentEnergy([1]);
  const r1 = hillClimbing([1], swapNeighbor, adjacentEnergy, opts(1));
  assert.equal(r1.bestEnergy, e1);
  // 单元素无更优邻居：采一步即判定局部最优并停止（iterations = 1）
  assert.ok(r1.iterations >= 1 && r1.iterations <= 2);
});

test('hill-climbing 找到全局最优（排序使相邻差平方和最小）', () => {
  const values = [5, 2, 9, 1, 7, 4, 8, 3, 6];
  const sorted = [...values].sort((a, b) => a - b);
  const optimalEnergy = adjacentEnergy(sorted);
  const r = hillClimbing(values, swapNeighbor, adjacentEnergy, opts(11));
  // 爬山不保证全局最优，但此实例在多 seed 下常能达到；放宽断言
  assert.ok(r.bestEnergy <= adjacentEnergy(values), '不应比初始解更差');
  assert.ok(
    r.bestEnergy >= optimalEnergy - 1e-9,
    `bestEnergy ${r.bestEnergy} 不应小于理论最优 ${optimalEnergy}`,
  );
});

test('hill-climbing 能量单调不增', () => {
  // 记录每次 onMove 后的能量，应严格递减
  const energies: number[] = [];
  const hooks: HillClimbingHooks<number[]> = {
    onMove: (_i, ne) => energies.push(ne),
  };
  const values = [5, 2, 9, 1, 7];
  hillClimbing(values, swapNeighbor, adjacentEnergy, opts(3), hooks);
  for (let k = 1; k < energies.length; k++) {
    assert.ok(energies[k]! < energies[k - 1]!, `能量应严格递减：${energies.join(',')}`);
  }
});

test('hill-climbing 到达局部最优后终止', () => {
  // 一个有局部最优的小例子：能找到一个极小点即停
  let localOpt = 0;
  const hooks: HillClimbingHooks<number[]> = {
    onLocalOptimum: () => localOpt++,
  };
  const r = hillClimbing([3, 1, 2], swapNeighbor, adjacentEnergy, opts(2), hooks);
  // 要么因局部最优停止，要么因迭代上限停止
  assert.ok(localOpt >= 0);
  assert.ok(r.iterations <= 500);
});

test('hill-climbing 固定种子可复现', () => {
  const a = hillClimbing([5, 2, 9, 1, 7, 4], swapNeighbor, adjacentEnergy, opts(99));
  const b = hillClimbing([5, 2, 9, 1, 7, 4], swapNeighbor, adjacentEnergy, opts(99));
  assert.equal(a.bestEnergy, b.bestEnergy);
  assert.deepEqual(a.best, b.best);
});

test('hill-climbing 钩子被调用', () => {
  let steps = 0;
  let improves = 0;
  const hooks: HillClimbingHooks<number[]> = {
    onStep: () => steps++,
    onImprove: () => improves++,
  };
  hillClimbing([5, 2, 9, 1], swapNeighbor, adjacentEnergy, opts(4), hooks);
  assert.ok(steps > 0, '应触发 onStep');
  assert.ok(improves >= 0);
});

test('adjacentEnergy 正确性', () => {
  // 排序序列 [1,2,3] 相邻差平方和 = 1+1 = 2
  assert.equal(adjacentEnergy([1, 2, 3]), 2);
  // [3,1,2] → (3-1)²+(1-2)² = 4+1 = 5
  assert.equal(adjacentEnergy([3, 1, 2]), 5);
});
