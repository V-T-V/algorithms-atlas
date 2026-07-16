// =============================================================================
// 线性回归 · 录制帧序列
// 用 setGraph 展示散点 + 拟合直线（用一条边连接两端点表示）。
// =============================================================================

import type { BarRole, Frame, GraphNode, GraphEdge } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { linearRegression, type LinearRegressionHooks, type Observation } from './impl.ts';

export const DEFAULT_INPUT: Observation[] = [
  { x: 1, y: 2.1 },
  { x: 2, y: 3.9 },
  { x: 3, y: 6.2 },
  { x: 4, y: 8.1 },
  { x: 5, y: 10.0 },
  { x: 6, y: 11.8 },
  { x: 7, y: 14.2 },
];

/** 归一化到 [0,1]×[0,1]（y 翻转）。 */
function makeNorm(
  data: Observation[],
  fitLine?: { x0: number; x1: number; y0: number; y1: number },
) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const d of data) {
    if (d.x < minX) minX = d.x;
    if (d.x > maxX) maxX = d.x;
    if (d.y < minY) minY = d.y;
    if (d.y > maxY) maxY = d.y;
  }
  if (fitLine) {
    minX = Math.min(minX, fitLine.x0);
    maxX = Math.max(maxX, fitLine.x1);
    minY = Math.min(minY, fitLine.y0, fitLine.y1);
    maxY = Math.max(maxY, fitLine.y0, fitLine.y1);
  }
  const pad = 0.08;
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  return (x: number, y: number) => ({
    x: pad + ((x - minX) / spanX) * (1 - 2 * pad),
    y: 1 - (pad + ((y - minY) / spanY) * (1 - 2 * pad)),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: Observation[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  // 散点帧
  const norm0 = makeNorm(input);
  const scatterNodes: GraphNode[] = input.map((d, i) => {
    const np = norm0(d.x, d.y);
    return { id: `p${i}`, label: `(${d.x},${d.y})`, x: np.x, y: np.y, role: 'default' as BarRole };
  });
  rec
    .begin({ zh: `${n} 个观测点`, en: `${n} observations` })
    .setGraph(scatterNodes, [])
    .setAux([{ label: '目标', value: '求 ŷ = slope·x + intercept', role: 'pivot' as BarRole }])
    .commit();

  let currentSlope = 0;
  let currentIntercept = 0;
  let statsAux: Array<{ label: string; value: string; role?: BarRole }> = [];

  const evalLine = (x: number): number => currentSlope * x + currentIntercept;

  const renderFit = (note: { zh: string; en: string }, showLine: boolean): void => {
    // 直线两端 x 用数据范围
    let minX = Infinity,
      maxX = -Infinity;
    for (const d of input) {
      if (d.x < minX) minX = d.x;
      if (d.x > maxX) maxX = d.x;
    }
    const y0 = evalLine(minX);
    const y1 = evalLine(maxX);
    const lineEnds = { x0: minX, x1: maxX, y0, y1 };
    const norm = makeNorm(input, showLine ? lineEnds : undefined);

    const nodes: GraphNode[] = input.map((d, i) => {
      const np = norm(d.x, d.y);
      return {
        id: `p${i}`,
        label: `(${d.x},${d.y})`,
        x: np.x,
        y: np.y,
        role: 'default' as BarRole,
      };
    });
    const edges: GraphEdge[] = [];
    if (showLine) {
      const a = norm(minX, y0);
      const b = norm(maxX, y1);
      nodes.push({ id: 'line-a', x: a.x, y: a.y, role: 'final' as BarRole });
      nodes.push({ id: 'line-b', x: b.x, y: b.y, role: 'final' as BarRole });
      edges.push({ from: 'line-a', to: 'line-b', role: 'final' as BarRole });
    }
    rec.begin(note).setGraph(nodes, edges).setAux(statsAux).commit();
  };

  const hooks: LinearRegressionHooks = {
    onStats: (meanX, meanY, varX, covXY) => {
      statsAux = [
        { label: 'x̄', value: meanX.toFixed(3), role: 'compare' as BarRole },
        { label: 'ȳ', value: meanY.toFixed(3), role: 'compare' as BarRole },
        { label: 'Var(x)', value: varX.toFixed(3), role: 'pivot' as BarRole },
        { label: 'Cov(x,y)', value: covXY.toFixed(3), role: 'pivot' as BarRole },
      ];
      renderFit(
        {
          zh: `统计量：x̄=${meanX.toFixed(2)}, ȳ=${meanY.toFixed(2)}, Var=${varX.toFixed(2)}, Cov=${covXY.toFixed(2)}`,
          en: `Stats: x̄=${meanX.toFixed(2)}, ȳ=${meanY.toFixed(2)}, Var=${varX.toFixed(2)}, Cov=${covXY.toFixed(2)}`,
        },
        false,
      );
    },
    onUpdateSlope: (slope) => {
      currentSlope = slope;
      statsAux = [
        ...statsAux,
        { label: 'slope', value: slope.toFixed(4), role: 'warn' as BarRole },
      ];
      renderFit(
        {
          zh: `斜率 slope = Cov/Var = ${slope.toFixed(4)}`,
          en: `slope = Cov/Var = ${slope.toFixed(4)}`,
        },
        false,
      );
    },
    onUpdateIntercept: (intercept) => {
      currentIntercept = intercept;
      statsAux = [
        ...statsAux,
        { label: 'intercept', value: intercept.toFixed(4), role: 'warn' as BarRole },
      ];
      renderFit(
        {
          zh: `截距 = ȳ − slope·x̄ = ${intercept.toFixed(4)}`,
          en: `intercept = ȳ − slope·x̄ = ${intercept.toFixed(4)}`,
        },
        true,
      );
    },
    onConverge: (fit) => {
      statsAux = [
        { label: 'slope', value: fit.slope.toFixed(4), role: 'final' as BarRole },
        { label: 'intercept', value: fit.intercept.toFixed(4), role: 'final' as BarRole },
        { label: 'R²', value: fit.r2.toFixed(4), role: 'final' as BarRole },
      ];
      renderFit(
        { zh: `拟合完成：R² = ${fit.r2.toFixed(4)}`, en: `Fit done: R² = ${fit.r2.toFixed(4)}` },
        true,
      );
    },
  };

  linearRegression(input, hooks);

  return rec.build();
}
