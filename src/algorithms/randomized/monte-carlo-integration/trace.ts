// =============================================================================
// 蒙特卡洛积分 · 录制帧序列
// 用 setGraph 展示包围盒内的采样点（曲线下=final，曲线外=warn），
// 曲线本身用一组节点连成弧线近似。setAux 展示估计值与真值。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  monteCarloIntegrate,
  mulberry32,
  type MonteCarloIntegralHooks,
  type SamplePoint,
} from './impl.ts';

export const DEFAULT_INPUT = {
  // 估计 ∫_0^π sin(x) dx = 2
  f: Math.sin,
  fLabel: 'sin(x)',
  a: 0,
  b: Math.PI,
  c: 0,
  d: 1,
  truth: 2,
  n: 500,
  seed: 42,
};

interface BuildTraceInput {
  f?: (x: number) => number;
  fLabel?: string;
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  truth?: number;
  n?: number;
  seed?: number;
}

/** 把世界坐标 (x∈[a,b], y∈[c,d]) 归一化到 [0,1]×[0,1]。 */
function normalize(
  x: number,
  y: number,
  a: number,
  b: number,
  c: number,
  d: number,
): { nx: number; ny: number } {
  return { nx: (x - a) / (b - a), ny: 1 - (y - c) / (d - c) };
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const f = input.f ?? DEFAULT_INPUT.f;
  const fLabel = input.fLabel ?? DEFAULT_INPUT.fLabel;
  const a = input.a ?? DEFAULT_INPUT.a;
  const b = input.b ?? DEFAULT_INPUT.b;
  const c = input.c ?? DEFAULT_INPUT.c;
  const d = input.d ?? DEFAULT_INPUT.d;
  const truth = input.truth ?? DEFAULT_INPUT.truth;
  const n = input.n ?? DEFAULT_INPUT.n;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();
  const points: SamplePoint[] = [];
  let lastEstimate = 0;

  // 曲线弧线（用于参考）
  const arcNodes: GraphNode[] = [];
  const arcEdges: GraphEdge[] = [];
  const arcSteps = 40;
  for (let i = 0; i <= arcSteps; i++) {
    const x = a + ((b - a) * i) / arcSteps;
    const y = f(x);
    const { nx, ny } = normalize(x, y, a, b, c, d);
    const id = `arc${i}`;
    arcNodes.push({ id, x: nx, y: ny, role: 'pivot' });
    if (i > 0) arcEdges.push({ from: `arc${i - 1}`, to: id, role: 'pivot' });
  }

  const render = (note: { zh: string; en: string }): void => {
    const sampleNodes: GraphNode[] = points.map((p, i) => {
      const { nx, ny } = normalize(p.x, p.y, a, b, c, d);
      return {
        id: `p${i}`,
        x: nx,
        y: ny,
        role: (p.under ? 'final' : 'warn') as BarRole,
      };
    });
    rec
      .begin(note)
      .setGraph([...arcNodes, ...sampleNodes], arcEdges)
      .setAux([
        { label: '积分估计', value: lastEstimate.toFixed(4), role: 'final' as BarRole },
        { label: '真值', value: truth.toFixed(4), role: 'default' as BarRole },
        {
          label: '误差',
          value: Math.abs(lastEstimate - truth).toFixed(4),
          role: 'warn' as BarRole,
        },
        { label: '采样数', value: String(points.length), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `蒙特卡洛积分 ∫_${a}^${b.toFixed(2)} ${fLabel} dx（真值≈${truth}），投 ${n} 点`,
    en: `Monte Carlo ∫_${a}^${b.toFixed(2)} ${fLabel} dx (truth≈${truth}), ${n} samples`,
  });

  const hooks: MonteCarloIntegralHooks = {
    onSample: (p) => {
      points.push(p);
    },
    onBatch: (estimate, total) => {
      lastEstimate = estimate;
      render({
        zh: `已投 ${total} 点，估计 ≈ ${estimate.toFixed(4)}`,
        en: `${total} samples, estimate ≈ ${estimate.toFixed(4)}`,
      });
    },
  };

  const result = monteCarloIntegrate(
    f,
    a,
    b,
    c,
    d,
    n,
    mulberry32(seed),
    Math.max(1, Math.floor(n / 8)),
    hooks,
  );
  lastEstimate = result.estimate;

  // 终态
  const sampleNodes: GraphNode[] = points.map((p, i) => {
    const { nx, ny } = normalize(p.x, p.y, a, b, c, d);
    return {
      id: `p${i}`,
      x: nx,
      y: ny,
      role: (p.under ? 'final' : 'warn') as BarRole,
    };
  });
  rec
    .begin({
      zh: `完成：${result.totalCount} 点，估计 ≈ ${result.estimate.toFixed(4)}（真值 ${truth}，误差 ${Math.abs(result.estimate - truth).toFixed(4)}）`,
      en: `Done: ${result.totalCount} samples, estimate ≈ ${result.estimate.toFixed(4)} (truth ${truth}, err ${Math.abs(result.estimate - truth).toFixed(4)})`,
    })
    .setGraph([...arcNodes, ...sampleNodes], arcEdges)
    .setAux([
      { label: '积分估计', value: result.estimate.toFixed(4), role: 'final' },
      { label: '真值', value: truth.toFixed(4), role: 'default' },
      { label: '误差', value: Math.abs(result.estimate - truth).toFixed(4), role: 'warn' },
      { label: '曲线下点数', value: String(result.underCount), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
