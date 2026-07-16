// =============================================================================
// t-SNE · 录制帧序列
// 用 setGraph 展示 2D 嵌入逐步演化。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tsne, type HighDimPoint, type TSneHooks } from './impl.ts';

export interface TSneInput {
  X: HighDimPoint[];
  labels?: number[];
  maxIterations?: number;
  seed?: number;
}

/** 三个分簇的 3D 数据。 */
export const DEFAULT_INPUT: TSneInput = {
  X: [
    // 簇 0
    [0, 0, 0],
    [0.5, 0.2, 0.1],
    [0.2, 0.5, 0.3],
    // 簇 1
    [10, 10, 10],
    [10.4, 9.8, 10.2],
    [9.7, 10.3, 9.9],
    // 簇 2
    [0, 10, 5],
    [0.4, 9.7, 5.2],
    [0.2, 10.4, 4.8],
  ],
  labels: [0, 0, 0, 1, 1, 1, 2, 2, 2],
  maxIterations: 200,
  seed: 42,
};

const CLUSTER_ROLES: BarRole[] = ['default', 'compare', 'swap', 'pivot'];

/** 录制演示帧序列。 */
export function buildTrace(input: TSneInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, labels, maxIterations = 200, seed = 42 } = input;
  const n = X.length;

  const render = (
    embedding: Array<{ x: number; y: number }>,
    note: { zh: string; en: string },
    options: { final?: boolean } = {},
  ): void => {
    // 归一化到 [0,1]²
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const p of embedding) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const sx = maxX - minX || 1;
    const sy = maxY - minY || 1;
    const pad = 0.08;
    const nodes: GraphNode[] = embedding.map((p, i) => ({
      id: `p${i}`,
      label: `P${i}`,
      x: pad + ((p.x - minX) / sx) * (1 - 2 * pad),
      y: 1 - (pad + ((p.y - minY) / sy) * (1 - 2 * pad)),
      role: labels
        ? options.final
          ? 'final'
          : CLUSTER_ROLES[labels[i]! % CLUSTER_ROLES.length]!
        : 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, [] as GraphEdge[])
      .commit();
  };

  // 初始随机嵌入
  const initEmbed = Array.from({ length: n }, (_, i) => ({ x: i * 1e-4, y: (n - i) * 1e-4 }));
  render(initEmbed, { zh: `初始化：${n} 个 3D 点降至 2D`, en: `Init: ${n} 3D points → 2D` });

  const hooks: TSneHooks = {
    onIteration: (iter, embedding, kl) => {
      // 隔若干帧记录一次，避免帧过多
      if (iter % 10 === 0 || iter < 5) {
        render(embedding, {
          zh: `第 ${iter + 1} 轮，KL = ${kl.toFixed(4)}`,
          en: `Iter ${iter + 1}, KL = ${kl.toFixed(4)}`,
        });
      }
    },
  };

  const result = tsne(X, { maxIterations, seed }, hooks);
  render(
    result.embedding,
    {
      zh: `完成：${result.iterations} 轮，KL = ${result.klDivergence.toFixed(4)}`,
      en: `Done: ${result.iterations} iters, KL = ${result.klDivergence.toFixed(4)}`,
    },
    { final: true },
  );

  return rec.build();
}
