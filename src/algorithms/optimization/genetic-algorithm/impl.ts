// =============================================================================
// 遗传算法 Genetic Algorithm · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一代操作，供录制器使用。
// 演示问题：One-Max（最大化二进制串中 1 的个数）。
// =============================================================================

/** 一个个体：基因型（0/1 数组）+ 适应度。 */
export interface Individual {
  genes: number[];
  fitness: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GeneticAlgorithmHooks {
  /** 一代评估完成：种群、平均适应度、最优适应度。 */
  onEvaluate?: (gen: number, population: Individual[], avg: number, best: number) => void;
  /** 选择阶段：被选中的双亲下标对。 */
  onSelect?: (gen: number, parents: Array<[number, number]>) => void;
  /** 交叉阶段：产出新个体数。 */
  onCrossover?: (gen: number, offspring: Individual[]) => void;
  /** 变异阶段：发生翻转的位数。 */
  onMutate?: (gen: number, flips: number) => void;
}

export interface GAOptions {
  /** 种群大小。 */
  populationSize: number;
  /** 基因长度。 */
  geneLength: number;
  /** 交叉概率（每对双亲）。 */
  crossoverRate: number;
  /** 变异概率（每位）。 */
  mutationRate: number;
  /** 最大代数。 */
  maxGenerations: number;
  /** 找到此适应度即提前停止（如 geneLength 表示全 1）。 */
  targetFitness?: number;
  /** 随机数发生器。 */
  rng: () => number;
}

export interface GAResult {
  /** 历代最优个体。 */
  best: Individual;
  /** 收敛代数（达到目标或最大代数）。 */
  generations: number;
  /** 历代平均适应度序列。 */
  avgHistory: number[];
  /** 历代最优适应度序列。 */
  bestHistory: number[];
  /** 是否达到目标。 */
  converged: boolean;
}

/** mulberry32 伪随机数发生器（确定性）。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One-Max 适应度：1 的个数。 */
export function oneMaxFitness(genes: readonly number[]): number {
  let s = 0;
  for (const g of genes) if (g === 1) s++;
  return s;
}

/** 随机初始化一个个体。 */
function randomIndividual(geneLength: number, rng: () => number): Individual {
  const genes = Array.from({ length: geneLength }, () => (rng() < 0.5 ? 0 : 1));
  return { genes, fitness: oneMaxFitness(genes) };
}

/** 锦标赛选择（tournament size = 3）。返回选中者下标。 */
function tournamentSelect(population: Individual[], rng: () => number, size = 3): number {
  let bestIdx = -1;
  let bestFit = -1;
  for (let i = 0; i < size; i++) {
    const idx = Math.floor(rng() * population.length);
    if (population[idx]!.fitness > bestFit) {
      bestFit = population[idx]!.fitness;
      bestIdx = idx;
    }
  }
  return bestIdx;
}

/** 单点交叉：返回两个孩子。 */
function crossover(a: Individual, b: Individual, rng: () => number): [Individual, Individual] {
  const n = a.genes.length;
  const point = 1 + Math.floor(rng() * (n - 1)); // 1..n-1
  const c1 = a.genes.slice(0, point).concat(b.genes.slice(point));
  const c2 = b.genes.slice(0, point).concat(a.genes.slice(point));
  return [
    { genes: c1, fitness: oneMaxFitness(c1) },
    { genes: c2, fitness: oneMaxFitness(c2) },
  ];
}

/** 逐位变异（原地）。返回翻转位数。 */
function mutate(genes: number[], rate: number, rng: () => number): number {
  let flips = 0;
  for (let i = 0; i < genes.length; i++) {
    if (rng() < rate) {
      genes[i] = genes[i] === 1 ? 0 : 1;
      flips++;
    }
  }
  return flips;
}

/**
 * 遗传算法（求解 One-Max）。
 *
 * @param options 配置
 * @param hooks 可选的事件钩子
 */
export function geneticAlgorithm(options: GAOptions, hooks: GeneticAlgorithmHooks = {}): GAResult {
  const { populationSize, geneLength, crossoverRate, mutationRate, maxGenerations, rng } = options;
  const targetFitness = options.targetFitness ?? geneLength;

  // 1. 初始化种群
  let population = Array.from({ length: populationSize }, () => randomIndividual(geneLength, rng));

  let best = population.reduce((b, ind) => (ind.fitness > b.fitness ? ind : b));
  const avgHistory: number[] = [];
  const bestHistory: number[] = [];

  let gen = 0;
  let converged = false;

  for (; gen < maxGenerations; gen++) {
    // 评估 + 记录
    const total = population.reduce((s, ind) => s + ind.fitness, 0);
    const avg = total / populationSize;
    avgHistory.push(avg);
    bestHistory.push(best.fitness);
    hooks.onEvaluate?.(
      gen,
      population.map((ind) => ({ ...ind, genes: [...ind.genes] })),
      avg,
      best.fitness,
    );

    if (best.fitness >= targetFitness) {
      converged = true;
      break;
    }

    // 2. 选择（精英保留：最优直接进下一代）
    const parents: Array<[number, number]> = [];
    const next: Individual[] = [{ ...best, genes: [...best.genes] }]; // 精英

    while (next.length < populationSize) {
      const pi = tournamentSelect(population, rng);
      const pj = tournamentSelect(population, rng);
      parents.push([pi, pj]);

      let children: [Individual, Individual];
      if (rng() < crossoverRate) {
        children = crossover(population[pi]!, population[pj]!, rng);
      } else {
        // 直接复制双亲
        children = [
          { ...population[pi]!, genes: [...population[pi]!.genes] },
          { ...population[pj]!, genes: [...population[pj]!.genes] },
        ];
      }
      hooks.onCrossover?.(gen, children);
      for (const child of children) {
        if (next.length >= populationSize) break;
        next.push(child);
      }
    }
    hooks.onSelect?.(gen, parents);

    // 3. 变异（精英除外）
    let flips = 0;
    for (let i = 1; i < next.length; i++) {
      flips += mutate(next[i]!.genes, mutationRate, rng);
      next[i]!.fitness = oneMaxFitness(next[i]!.genes);
    }
    hooks.onMutate?.(gen, flips);

    population = next;
    // 更新最优
    for (const ind of population) {
      if (ind.fitness > best.fitness) best = { ...ind, genes: [...ind.genes] };
    }
  }

  // 最终一代统计
  if (!converged) {
    const total = population.reduce((s, ind) => s + ind.fitness, 0);
    avgHistory.push(total / populationSize);
    bestHistory.push(best.fitness);
  }

  return { best, generations: gen, avgHistory, bestHistory, converged };
}
