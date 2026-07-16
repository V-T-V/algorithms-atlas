// =============================================================================
// 蒙特卡洛求 π · 录制帧序列
// 用 setGraph 展示单位正方形内的随机点（x/y 归一化 0~1）：
//   落在 1/4 圆内='final'，圆外='warn'。setAux 展示 π 估计与总点数。
// 固定种子保证可复现。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { monteCarloPi, mulberry32, type MonteCarloHooks, type Point } from './impl.ts';

/** 默认采样点数。 */
export const DEFAULT_INPUT = 400;
/** 固定种子。 */
export const DEFAULT_SEED = 42;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT, seed: number = DEFAULT_SEED): Frame[] {
  const rec = new TraceRecorder();
  const batchSize = Math.max(1, Math.floor(n / 8));
  let insideCount = 0;
  let totalCount = 0;
  let lastPi = 0;
  const points: Point[] = [];

  // 1/4 圆轮廓点（用于可视化参考，作为图的「边」连成弧线近似）
  const arcNodes: GraphNode[] = [];
  const arcEdges: GraphEdge[] = [];
  const arcSteps = 24;
  for (let i = 0; i <= arcSteps; i++) {
    const theta = (Math.PI / 2) * (i / arcSteps); // 0 .. π/2
    const ax = Math.cos(theta);
    const ay = Math.sin(theta);
    const id = `arc${i}`;
    arcNodes.push({ id, x: ax, y: ay, role: 'pivot' });
    if (i > 0) arcEdges.push({ from: `arc${i - 1}`, to: id, role: 'pivot' });
  }

  const render = (note: { zh: string; en: string }): void => {
    // 点作为图节点（坐标即 x,y，已在 0~1）
    const sampleNodes: GraphNode[] = points.map((p, i) => ({
      id: `p${i}`,
      x: p.x,
      y: p.y,
      role: (p.inside ? 'final' : 'warn') as BarRole,
    }));
    const nodes = [...arcNodes, ...sampleNodes];
    rec
      .begin(note)
      .setGraph(nodes, arcEdges)
      .setAux([
        {
          label: 'π 估计',
          value: lastPi.toFixed(4),
          role: 'final' as BarRole,
        },
        {
          label: '总点数',
          value: String(totalCount),
          role: 'default' as BarRole,
        },
        {
          label: '圆内点数',
          value: String(insideCount),
          role: 'final' as BarRole,
        },
        {
          label: '公式',
          value: '4 × 内 / 总',
          role: 'pivot' as BarRole,
        },
      ])
      .commit();
  };

  render({
    zh: `蒙特卡洛求 π：在单位正方形内随机撒 ${n} 个点（种子 ${seed}）`,
    en: `Monte Carlo π: scatter ${n} random points in unit square (seed ${seed})`,
  });

  const hooks: MonteCarloHooks = {
    onSample: (p, inside, total) => {
      points.push(p);
      insideCount = inside;
      totalCount = total;
    },
    onBatch: (piEst, total) => {
      lastPi = piEst;
      totalCount = total;
      render({
        zh: `已投 ${total} 点，圆内 ${insideCount}，π ≈ ${piEst.toFixed(4)}`,
        en: `${total} points sampled, ${insideCount} inside, π ≈ ${piEst.toFixed(4)}`,
      });
    },
  };

  const result = monteCarloPi(n, mulberry32(seed), batchSize, hooks);

  // 终态
  lastPi = result.pi;
  totalCount = result.totalCount;
  insideCount = result.insideCount;
  const sampleNodes: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    x: p.x,
    y: p.y,
    role: (p.inside ? 'final' : 'warn') as BarRole,
  }));
  rec
    .begin({
      zh: `完成：${result.totalCount} 点，圆内 ${result.insideCount}，π ≈ ${result.pi.toFixed(4)}（真值 ${Math.PI.toFixed(4)}）`,
      en: `Done: ${result.totalCount} points, ${result.insideCount} inside, π ≈ ${result.pi.toFixed(4)} (true ${Math.PI.toFixed(4)})`,
    })
    .setGraph([...arcNodes, ...sampleNodes], arcEdges)
    .setAux([
      { label: 'π 估计', value: result.pi.toFixed(4), role: 'final' },
      { label: 'π 真值', value: Math.PI.toFixed(4), role: 'default' },
      { label: '误差', value: Math.abs(result.pi - Math.PI).toFixed(4), role: 'warn' },
      { label: '总点数', value: String(result.totalCount), role: 'final' },
    ])
    .commit();

  return rec.build();
}
