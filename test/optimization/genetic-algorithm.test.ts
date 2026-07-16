import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  geneticAlgorithm,
  mulberry32,
  oneMaxFitness,
  type GAOptions,
} from '../../src/algorithms/optimization/genetic-algorithm/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/optimization/genetic-algorithm/trace.ts';

const baseOptions = (seed: number): GAOptions => ({
  populationSize: 30,
  geneLength: 12,
  crossoverRate: 0.85,
  mutationRate: 0.03,
  maxGenerations: 100,
  targetFitness: 12,
  rng: mulberry32(seed),
});

test('oneMaxFitness 计数 1', () => {
  assert.equal(oneMaxFitness([0, 0, 0]), 0);
  assert.equal(oneMaxFitness([1, 1, 1]), 3);
  assert.equal(oneMaxFitness([1, 0, 1, 0, 1]), 3);
});

test('geneticAlgorithm 能收敛到全 1（One-Max）', () => {
  const r = geneticAlgorithm(baseOptions(7));
  assert.equal(r.best.fitness, 12, `best=${r.best.fitness}, genes=${r.best.genes.join('')}`);
  assert.ok(r.converged);
  assert.deepEqual(r.best.genes, Array(12).fill(1));
});

test('geneticAlgorithm 确定性（同种子同结果）', () => {
  const a = geneticAlgorithm(baseOptions(42));
  const b = geneticAlgorithm(baseOptions(42));
  assert.deepEqual(a.best.genes, b.best.genes);
  assert.equal(a.generations, b.generations);
  assert.deepEqual(a.bestHistory, b.bestHistory);
});

test('geneticAlgorithm 最优历史单调不减', () => {
  const r = geneticAlgorithm(baseOptions(3));
  for (let i = 1; i < r.bestHistory.length; i++) {
    assert.ok(r.bestHistory[i]! >= r.bestHistory[i - 1]!, '最优适应度不应下降（精英保留）');
  }
});

test('geneticAlgorithm 平均适应度趋向上升', () => {
  const r = geneticAlgorithm(baseOptions(5));
  assert.ok(r.avgHistory.length >= 2);
  // 末段平均应高于首段
  assert.ok(r.avgHistory[r.avgHistory.length - 1]! > r.avgHistory[0]!);
});

test('geneticAlgorithm 尊重 maxGenerations', () => {
  const opts = baseOptions(1);
  opts.maxGenerations = 5;
  const r = geneticAlgorithm(opts);
  assert.ok(r.generations <= 5);
});

test('geneticAlgorithm 钩子被调用', () => {
  let evals = 0;
  let mutates = 0;
  let crossovers = 0;
  geneticAlgorithm(baseOptions(9), {
    onEvaluate: () => evals++,
    onMutate: () => mutates++,
    onCrossover: () => crossovers++,
  });
  assert.ok(evals >= 1);
  assert.ok(mutates >= 1);
  assert.ok(crossovers >= 1);
});

test('mulberry32 同种子同序列', () => {
  const a = Array.from({ length: 5 }, mulberry32(11));
  const b = Array.from({ length: 5 }, mulberry32(11));
  assert.deepEqual(a, b);
});

test('buildTrace 生成种群帧且末帧展示最优基因', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  // 存在含 bars（种群适应度）且含 aux 的帧
  assert.ok(frames.some((f) => f.bars && f.bars.length > 0 && f.aux));
  // 末帧：最优基因串全 1
  const last = frames[frames.length - 1]!;
  const geneEntry = last.aux!.find((e) => e.label === '最优基因');
  assert.ok(geneEntry);
  assert.equal(geneEntry!.value, '1'.repeat(DEFAULT_INPUT.geneLength ?? 10));
});
