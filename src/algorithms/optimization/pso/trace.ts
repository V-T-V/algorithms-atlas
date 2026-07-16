// =============================================================================
// 粒子群优化 · 录制帧序列
// 用 setGraph 展示粒子位置（归一化坐标），全局最优='final'；
// setAux 展示最优值/迭代/参数。
// =============================================================================

import type { BarRole, Frame, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pso, mulberry32, type PsoHooks, type PsoOptions } from './impl.ts';

export interface PsoInput {
  seed?: number;
}

/** 演示问题：最小化 sphere 函数 f(x,y) = x² + y²（最优解 (0,0)，值为 0）。 */
function sphere(x: number[]): number {
  return x.reduce((s, v) => s + v * v, 0);
}

export const DEFAULT_INPUT: PsoInput = { seed: 42 };

/** 录制演示帧序列。 */
export function buildTrace(input: PsoInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { seed = 42 } = input;

  const bounds = { lo: -5, hi: 5 };
  const padding = 0.06;
  const span = bounds.hi - bounds.lo;
  // 归一化：x∈[lo,hi] → [padding, 1-padding]，y 翻转
  const norm = (x: number, y: number): { x: number; y: number } => ({
    x: padding + ((x - bounds.lo) / span) * (1 - 2 * padding),
    y: 1 - (padding + ((y - bounds.lo) / span) * (1 - 2 * padding)),
  });

  let bestFit = Infinity;
  let bestPos: number[] = [0, 0];
  let iter = 0;

  const render = (
    positions: number[][],
    note: { zh: string; en: string },
    options: { gBestRole?: BarRole } = {},
  ): void => {
    const nodes: GraphNode[] = positions.map((p, i) => {
      const np = norm(p[0]!, p[1]!);
      const isBest = bestPos[0] === p[0] && bestPos[1] === p[1] && bestFit < Infinity;
      return {
        id: `p${i}`,
        label: `P${i}`,
        x: np.x,
        y: np.y,
        role: (isBest ? (options.gBestRole ?? 'final') : 'default') as BarRole,
      };
    });
    // 标记全局最优位置（理论最优点原点）
    const no = norm(0, 0);
    nodes.push({ id: 'opt', label: '★', x: no.x, y: no.y, role: 'pivot' });

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '迭代 / iter', value: String(iter), role: 'default' as BarRole },
      {
        label: '最优适应度',
        value: bestFit === Infinity ? '∞' : bestFit.toExponential(3),
        role: 'final' as BarRole,
      },
      {
        label: '最优位置',
        value: `(${bestPos[0]!.toFixed(3)}, ${bestPos[1]!.toFixed(3)})`,
        role: 'frontier' as BarRole,
      },
      { label: '目标 / target', value: 'min x²+y²（最优 (0,0)）', role: 'pivot' as BarRole },
    ];

    rec.begin(note).setGraph(nodes, []).setAux(aux).commit();
  };

  const options: PsoOptions = {
    swarmSize: 12,
    maxIterations: 60,
    inertia: 0.7,
    cognitive: 1.5,
    social: 1.5,
    bounds,
    tolerance: 1e-6,
    rng: mulberry32(seed),
  };

  // 预演初始位置（与内核一致的初始化）
  const rng = mulberry32(seed);
  const initPos: number[][] = [];
  for (let i = 0; i < options.swarmSize; i++) {
    initPos.push([bounds.lo + rng() * span, bounds.lo + rng() * span]);
  }
  render(initPos, {
    zh: `初始化 ${options.swarmSize} 个粒子（种子 ${seed}），目标最小化 x²+y²`,
    en: `Init ${options.swarmSize} particles (seed ${seed}), minimize x²+y²`,
  });

  const hooks: PsoHooks = {
    onIteration: (i, positions) => {
      iter = i + 1;
      render(positions, {
        zh: `第 ${i + 1} 轮：更新速度与位置`,
        en: `Iter ${i + 1}: update velocity & position`,
      });
    },
    onGlobalBest: (pos, fit) => {
      bestPos = [...pos];
      bestFit = fit;
    },
    onResult: (result) => {
      bestPos = [...result.bestPosition];
      bestFit = result.bestFitness;
      render(
        // 最终位置无法从结果取，用最优位置代表
        [result.bestPosition],
        {
          zh: `完成：${result.iterations} 轮，最优 ${result.bestFitness.toExponential(3)}（位置 ${result.bestPosition.map((v) => v.toFixed(3)).join(', ')}）`,
          en: `Done: ${result.iterations} iters, best ${result.bestFitness.toExponential(3)} (at ${result.bestPosition.map((v) => v.toFixed(3)).join(', ')})`,
        },
        { gBestRole: 'final' },
      );
    },
  };

  pso(sphere, 2, options, hooks);

  return rec.build();
}
