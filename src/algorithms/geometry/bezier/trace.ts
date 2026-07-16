// 贝塞尔曲线 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { GraphNode } from '../../../types.ts';
import { bezierPoint, type Pt } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 三次贝塞尔的 4 个控制点
  const controls: Pt[] = [
    { x: 0, y: 0 },
    { x: 1, y: 3 },
    { x: 4, y: 3 },
    { x: 5, y: 0 },
  ];
  const t = 0.5;

  const range = 5;
  const norm = (pt: Pt): { x: number; y: number } => {
    const pad = 0.1;
    return {
      x: pad + (pt.x / range) * (1 - 2 * pad),
      y: pad + (1 - pt.y / range) * (1 - 2 * pad),
    };
  };

  // 初始：控制点 + 控制多边形
  const nodes0: GraphNode[] = controls.map((p, i) => ({
    id: `c${i}`,
    label: `P${i}`,
    ...norm(p),
    role: 'default',
  }));
  const polyEdges = controls
    .slice(0, -1)
    .map((_, i) => ({ from: `c${i}`, to: `c${i + 1}`, role: 'default' as const }));
  rec
    .begin({ zh: `4 个控制点（三次贝塞尔）`, en: `4 control points (cubic Bezier)` })
    .setGraph(nodes0, polyEdges)
    .setAux([{ label: `参数 t`, value: String(t) }])
    .commit();

  // 展示 de Casteljau 每一层
  bezierPoint(controls, t, {
    onLayer: (layer, points) => {
      if (layer === 0) return; // 跳过控制点层（已展示）
      const ns: GraphNode[] = points.map((p, i) => ({
        id: `l${layer}-${i}`,
        label: ``,
        ...norm(p),
        role: layer === points.length ? 'final' : 'compare',
      }));
      const allNodes = [...nodes0, ...ns];
      rec
        .begin({ zh: `第 ${layer} 层插值`, en: `Layer ${layer} interpolation` })
        .setGraph(allNodes, polyEdges)
        .setAux([{ label: `第 ${layer} 层点数`, value: String(points.length) }])
        .commit();
    },
  });

  // 最终曲线点
  const finalPt = bezierPoint(controls, t);
  const finalNodes: GraphNode[] = [
    ...nodes0,
    { id: 'b', label: 'B(t)', ...norm(finalPt), role: 'final' },
  ];
  rec
    .begin({
      zh: `B(${t}) = (${finalPt.x.toFixed(3)}, ${finalPt.y.toFixed(3)})`,
      en: `B(${t}) = (${finalPt.x.toFixed(3)}, ${finalPt.y.toFixed(3)})`,
    })
    .setGraph(finalNodes, polyEdges)
    .setAux([{ label: `曲线点`, value: `(${finalPt.x.toFixed(4)}, ${finalPt.y.toFixed(4)})` }])
    .commit();

  return rec.build();
}
