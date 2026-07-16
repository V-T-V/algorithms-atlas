// OPTICS 聚类 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole } from '../../../types.ts';
import { optics, extractDBSCAN, type Point } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 两个稠密簇 + 少量离群点
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 0.3, y: 0 },
    { x: 0, y: 0.3 },
    { x: 0.3, y: 0.3 },
    { x: 0.15, y: 0.15 },
    { x: 5, y: 5 },
    { x: 5.3, y: 5 },
    { x: 5, y: 5.3 },
    { x: 5.3, y: 5.3 },
    { x: 5.15, y: 5.15 },
    { x: 10, y: 10 }, // 离群点
  ];

  rec
    .begin({
      zh: `${points.length} 个点（两簇 + 离群）`,
      en: `${points.length} points (2 clusters + outlier)`,
    })
    .setAux([
      { label: `eps`, value: '0.6' },
      { label: `minPts`, value: '4' },
    ])
    .commit();

  const result = optics(points, 0.6, 4);

  // 可达性图
  const reachValues = result.order.map((e) =>
    Number.isFinite(e.reachability) ? e.reachability : 0,
  );
  rec
    .begin({ zh: `可达性图（按处理顺序）`, en: `Reachability plot (in processing order)` })
    .setBars(rec.barsFrom(reachValues))
    .setAux([{ label: `点数`, value: String(result.order.length) }])
    .commit();

  // 用 ε'=0.5 提取簇
  const labels = extractDBSCAN(result.order, 0.5);
  const labelCounts: Record<number, number> = {};
  for (const l of labels) labelCounts[l] = (labelCounts[l] ?? 0) + 1;
  rec
    .begin({ zh: `ε'=0.5 提取簇`, en: `Clusters extracted at ε'=0.5` })
    .setBars(rec.barsFrom(labels.map((l) => (l === -1 ? 0 : l + 1))))
    .setAux([
      {
        label: `簇数`,
        value: String(Math.max(0, ...labels.filter((l) => l >= 0).map((l) => l + 1))),
      },
      { label: `噪声数`, value: String(labels.filter((l) => l === -1).length) },
    ])
    .commit();

  // 用角色标注：把每个原点按其最终簇号染色
  const palette: BarRole[] = ['compare', 'final', 'frontier'];
  const orderedLabels: number[] = new Array(points.length).fill(-2);
  result.order.forEach((e, i) => {
    orderedLabels[e.index] = labels[i]!;
  });
  rec
    .begin({ zh: `最终聚类着色`, en: `Final cluster coloring` })
    .setBars(
      rec.barsFrom(
        orderedLabels.map((l) => (l === -1 ? 0 : l + 1)),
        orderedLabels.reduce<Record<number, BarRole>>((acc, l, i) => {
          if (l >= 0) acc[i] = palette[l % palette.length]!;
          else if (l === -1) acc[i] = 'warn';
          return acc;
        }, {}),
      ),
    )
    .commit();

  return rec.build();
}
