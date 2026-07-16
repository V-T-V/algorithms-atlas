// =============================================================================
// 逻辑回归 · 录制帧序列
// 用 setGraph 展示：数据点按真实标签着色（0/1 两种角色），决策边界用一条边表示。
// 用 setAux 展示：当前权重 w、偏置 b、本轮损失、迭代轮数。
// =============================================================================

import type { BarRole, Frame, GraphNode, GraphEdge } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { logisticRegression, type LogisticHooks, type LabeledPoint } from './impl.ts';

export const DEFAULT_INPUT: LabeledPoint[] = [
  // 类 0：左下簇
  { x: 1, y: 1, label: 0 },
  { x: 1.5, y: 2, label: 0 },
  { x: 2, y: 1, label: 0 },
  { x: 2, y: 2.5, label: 0 },
  { x: 1.2, y: 2.8, label: 0 },
  // 类 1：右上簇
  { x: 6, y: 6, label: 1 },
  { x: 7, y: 5, label: 1 },
  { x: 6.5, y: 7, label: 1 },
  { x: 5.5, y: 6.5, label: 1 },
  { x: 7.5, y: 6, label: 1 },
];

/** 归一化坐标到 [0,1]×[0,1]（y 翻转）。 */
function makeNorm(all: Array<{ x: number; y: number }>, pad = 0.08) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of all) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  return (x: number, y: number) => ({
    x: pad + ((x - minX) / spanX) * (1 - 2 * pad),
    y: 1 - (pad + ((y - minY) / spanY) * (1 - 2 * pad)),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: LabeledPoint[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const norm = makeNorm(input);

  // 边界直线端点 x（覆盖数据范围）
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of input) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const render = (
    weights: number[],
    bias: number,
    loss: number | null,
    iter: number,
    note: { zh: string; en: string },
    showBoundary: boolean,
  ): void => {
    const nodes: GraphNode[] = input.map((p, i) => {
      const np = norm(p.x, p.y);
      return {
        id: `p${i}`,
        label: `${p.label}`,
        x: np.x,
        y: np.y,
        role: (p.label === 1 ? 'compare' : 'default') as BarRole,
      };
    });
    const edges: GraphEdge[] = [];
    if (showBoundary) {
      // 决策边界：w0·x + w1·y + b = 0  →  y = -(w0·x + b)/w1
      const w0 = weights[0]!;
      const w1 = weights[1]!;
      if (Math.abs(w1) > 1e-9) {
        const yAtMinX = -(w0 * minX + bias) / w1;
        const yAtMaxX = -(w0 * maxX + bias) / w1;
        const a = norm(minX, yAtMinX);
        const b = norm(maxX, yAtMaxX);
        nodes.push({ id: 'bd-a', x: a.x, y: a.y, role: 'pivot' as BarRole });
        nodes.push({ id: 'bd-b', x: b.x, y: b.y, role: 'pivot' as BarRole });
        edges.push({ from: 'bd-a', to: 'bd-b', role: 'pivot' as BarRole });
      }
    }
    const aux = [
      { label: 'w0', value: weights[0]!.toFixed(4), role: 'warn' as BarRole },
      { label: 'w1', value: weights[1]!.toFixed(4), role: 'warn' as BarRole },
      { label: 'b', value: bias.toFixed(4), role: 'warn' as BarRole },
      {
        label: 'loss',
        value: loss === null ? '—' : loss.toFixed(6),
        role: 'pivot' as BarRole,
      },
      { label: 'iter', value: String(iter), role: 'frontier' as BarRole },
    ];
    rec.begin(note).setGraph(nodes, edges).setAux(aux).commit();
  };

  // 初始帧（参数未训练）
  render(
    [0, 0],
    0,
    null,
    0,
    {
      zh: `训练数据：${input.length} 个点（标签 0/1 各一簇）`,
      en: `Training data: ${input.length} points (two clusters, labels 0/1)`,
    },
    false,
  );

  let curW = [0, 0];
  let curB = 0;
  let curLoss: number | null = null;
  let curIter = 0;

  const hooks: LogisticHooks = {
    onIteration: (iter, weights, bias) => {
      curW = [...weights];
      curB = bias;
      curIter = iter;
    },
    onLoss: (iter, loss) => {
      curLoss = loss;
      render(
        curW,
        curB,
        curLoss,
        curIter,
        {
          zh: `第 ${iter + 1} 轮：loss = ${loss.toFixed(6)}`,
          en: `Iteration ${iter + 1}: loss = ${loss.toFixed(6)}`,
        },
        true,
      );
    },
    onUpdate: (_iter, weights, bias) => {
      curW = [...weights];
      curB = bias;
    },
    onConverge: (result) => {
      render(
        result.weights,
        result.bias,
        result.losses[result.losses.length - 1]!,
        result.iterations,
        {
          zh: `收敛：${result.iterations} 轮，准确率 ${(result.accuracy * 100).toFixed(0)}%`,
          en: `Converged in ${result.iterations} iterations, accuracy ${(result.accuracy * 100).toFixed(0)}%`,
        },
        true,
      );
    },
  };

  const result = logisticRegression(
    input,
    { learningRate: 0.2, maxIterations: 200, seed: 42 },
    hooks,
  );

  // 终态：参数定稿
  const finalAux: Array<{ label: string; value: string; role?: BarRole }> = [
    { label: 'w0', value: result.weights[0]!.toFixed(4), role: 'final' as BarRole },
    { label: 'w1', value: result.weights[1]!.toFixed(4), role: 'final' as BarRole },
    { label: 'b', value: result.bias.toFixed(4), role: 'final' as BarRole },
    { label: '准确率', value: `${(result.accuracy * 100).toFixed(0)}%`, role: 'final' as BarRole },
    { label: '轮数', value: String(result.iterations), role: 'frontier' as BarRole },
  ];
  rec
    .begin({
      zh: `训练完成：准确率 ${(result.accuracy * 100).toFixed(0)}%`,
      en: `Training done: accuracy ${(result.accuracy * 100).toFixed(0)}%`,
    })
    .setGraph(
      input.map((p, i) => {
        const np = norm(p.x, p.y);
        return {
          id: `p${i}`,
          label: `${p.label}`,
          x: np.x,
          y: np.y,
          role: 'final' as BarRole,
        };
      }),
      [],
    )
    .setAux(finalAux)
    .commit();

  return rec.build();
}
