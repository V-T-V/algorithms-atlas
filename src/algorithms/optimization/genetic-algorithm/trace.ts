// =============================================================================
// 遗传算法 · 录制帧序列
// 用 setBars 展示种群个体适应度，setAux 展示代数统计。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  geneticAlgorithm,
  mulberry32,
  type GAOptions,
  type GeneticAlgorithmHooks,
  type Individual,
} from './impl.ts';

export interface GAInput {
  populationSize?: number;
  geneLength?: number;
  seed?: number;
}

export const DEFAULT_INPUT: GAInput = {
  populationSize: 12,
  geneLength: 10,
  seed: 7,
};

/** 录制演示帧序列。 */
export function buildTrace(input: GAInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const populationSize = input.populationSize ?? 12;
  const geneLength = input.geneLength ?? 10;
  const seed = input.seed ?? 7;

  let curGen = 0;
  let curPopulation: Individual[] = [];
  let curAvg = 0;
  let curBest = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        curPopulation.map((ind, i) => ({
          value: ind.fitness,
          role: (ind.fitness === curBest ? 'final' : i === 0 ? 'pivot' : 'default') as BarRole,
          label: `${ind.fitness}`,
        })),
      )
      .setAux([
        { label: '代 / gen', value: String(curGen), role: 'default' as BarRole },
        { label: '平均适应度', value: curAvg.toFixed(2), role: 'compare' as BarRole },
        { label: '最优适应度', value: String(curBest), role: 'final' as BarRole },
        { label: '目标', value: String(geneLength), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `初始化：种群 ${populationSize}，基因长度 ${geneLength}（目标全 1）`,
      en: `Init: population ${populationSize}, gene length ${geneLength} (target all-ones)`,
    })
    .commit();

  const options: GAOptions = {
    populationSize,
    geneLength,
    crossoverRate: 0.85,
    mutationRate: 0.02,
    maxGenerations: 80,
    targetFitness: geneLength,
    rng: mulberry32(seed),
  };

  const hooks: GeneticAlgorithmHooks = {
    onEvaluate: (gen, population, avg, best) => {
      curGen = gen;
      curPopulation = population;
      curAvg = avg;
      curBest = best;
      snapshot({
        zh: `第 ${gen + 1} 代：平均 ${avg.toFixed(2)}，最优 ${best}`,
        en: `Gen ${gen + 1}: avg ${avg.toFixed(2)}, best ${best}`,
      });
    },
    onSelect: (gen, parents) => {
      // 不单独开帧（保持简洁），仅在 select 数较大时记录一次说明
      void gen;
      void parents;
    },
    onCrossover: () => {},
    onMutate: (gen, flips) => {
      // 变异摘要帧（轻量）
      rec
        .begin({
          zh: `第 ${gen + 1} 代变异：翻转 ${flips} 位`,
          en: `Gen ${gen + 1} mutation: ${flips} bits flipped`,
        })
        .setBars(
          curPopulation.map((ind) => ({
            value: ind.fitness,
            role: 'swap' as BarRole,
            label: String(ind.fitness),
          })),
        )
        .commit();
    },
  };

  const result = geneticAlgorithm(options, hooks);

  // 终态：最优个体
  rec
    .begin({
      zh: result.converged
        ? `第 ${result.generations + 1} 代收敛到最优 ${result.best.fitness}`
        : `达到最大代数，最优 ${result.best.fitness}`,
      en: result.converged
        ? `Converged at gen ${result.generations + 1}, best ${result.best.fitness}`
        : `Max generations reached, best ${result.best.fitness}`,
    })
    .setBars(
      result.best.genes.map((g) => ({
        value: g,
        role: 'final' as BarRole,
        label: g === 1 ? '1' : '0',
      })),
    )
    .setAux([
      { label: '最优适应度', value: String(result.best.fitness), role: 'final' as BarRole },
      { label: '目标', value: String(geneLength), role: 'pivot' as BarRole },
      { label: '代数', value: String(result.generations + 1), role: 'default' as BarRole },
      { label: '最优基因', value: result.best.genes.join(''), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
