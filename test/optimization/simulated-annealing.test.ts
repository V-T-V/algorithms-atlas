import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simulatedAnnealing,
  adjacentEnergy,
  swapNeighbor,
  mulberry32,
  type SAOptions,
} from '../../src/algorithms/optimization/simulated-annealing/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/optimization/simulated-annealing/trace.ts';

const baseOptions = (seed: number): SAOptions => ({
  initialTemp: 100,
  cooling: 0.95,
  minTemp: 0.5,
  maxIterations: 500,
  rng: mulberry32(seed),
});

test('adjacentEnergy 排序后最小', () => {
  const arr = [5, 2, 9, 1, 7];
  const shuffled = adjacentEnergy(arr);
  const sorted = adjacentEnergy([...arr].sort((a, b) => a - b));
  assert.ok(sorted <= shuffled);
});

test('swapNeighbor 长度不变且仅交换两元素', () => {
  const rng = mulberry32(1);
  const a = [1, 2, 3, 4, 5];
  const b = swapNeighbor(a, rng);
  assert.equal(b.length, a.length);
  assert.deepEqual([...b].sort(), [...a].sort(), '元素集合相同');
  let diffs = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diffs++;
  assert.equal(diffs, 2, '恰好两个位置变化');
});

test('simulatedAnnealing 找到不劣于初始的解', () => {
  const values = [5, 2, 9, 1, 7, 4, 8, 3, 6];
  const r = simulatedAnnealing(values, swapNeighbor, adjacentEnergy, baseOptions(7));
  assert.ok(r.bestEnergy <= adjacentEnergy(values));
});

test('simulatedAnnealing 结果优于或等于随机搜索量级', () => {
  const values = [10, 0, 8, 2, 6, 4];
  const r = simulatedAnnealing(values, swapNeighbor, adjacentEnergy, baseOptions(3));
  const optimal = adjacentEnergy([...values].sort((a, b) => a - b));
  // SA 应能接近最优（容许一定偏差）
  assert.ok(r.bestEnergy <= adjacentEnergy(values) * 0.6);
  assert.ok(r.bestEnergy >= optimal - 1e-9, '不应优于理论最优');
});

test('simulatedAnnealing 确定性（同种子同结果）', () => {
  const values = [5, 2, 9, 1, 7];
  const a = simulatedAnnealing(values, swapNeighbor, adjacentEnergy, baseOptions(42));
  const b = simulatedAnnealing(values, swapNeighbor, adjacentEnergy, baseOptions(42));
  assert.deepEqual(a.best, b.best);
  assert.equal(a.bestEnergy, b.bestEnergy);
  assert.equal(a.iterations, b.iterations);
});

test('simulatedAnnealing 尊重 maxIterations', () => {
  const values = [5, 2, 9, 1, 7];
  const opts = baseOptions(1);
  opts.maxIterations = 10;
  const r = simulatedAnnealing(values, swapNeighbor, adjacentEnergy, opts);
  assert.ok(r.iterations <= 10);
});

test('simulatedAnnealing 钩子被调用', () => {
  const values = [5, 2, 9, 1, 7];
  let steps = 0;
  let improves = 0;
  simulatedAnnealing(values, swapNeighbor, adjacentEnergy, baseOptions(5), {
    onStep: () => steps++,
    onImprove: () => improves++,
  });
  assert.ok(steps >= 1);
  assert.ok(improves >= 1, '至少改进一次（初始即被记录或后续改进）');
});

test('mulberry32 同种子同序列', () => {
  const a = Array.from({ length: 5 }, mulberry32(99));
  const b = Array.from({ length: 5 }, mulberry32(99));
  assert.deepEqual(a, b);
});

test('buildTrace 生成有序帧且末帧为最优解', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  // 中间帧含 aux（温度/能量）
  assert.ok(frames.some((f) => f.aux && f.aux.length > 0));
  // 末帧为最优解，全部 final
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars);
  assert.ok(last.bars!.every((b) => b.role === 'final'));
  // 末帧能量不大于初始能量
  const bestEnergyEntry = last.aux!.find((e) => e.label === '最优能量');
  assert.ok(bestEnergyEntry);
  const initial = adjacentEnergy(DEFAULT_INPUT.values);
  assert.ok(parseFloat(bestEnergyEntry!.value) <= initial + 1e-9);
});
