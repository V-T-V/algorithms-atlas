// 凝聚层次聚类 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole, TreeNode } from '../../../types.ts';
import { agglomerative, type Point } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 0.5, y: 0 },
    { x: 0, y: 0.5 }, // 簇 A
    { x: 5, y: 5 },
    { x: 5.5, y: 5 },
    { x: 5, y: 5.5 }, // 簇 B
    { x: 10, y: 0 },
    { x: 10.5, y: 0 }, // 簇 C
  ];

  rec
    .begin({
      zh: `${points.length} 个点（3 个自然簇）`,
      en: `${points.length} points (3 natural clusters)`,
    })
    .setAux([
      { label: `链接`, value: 'average' },
      { label: `点数`, value: String(points.length) },
    ])
    .commit();

  const { merges, labels } = agglomerative(points, 'average', 3);

  // 展示合并序列的距离（dendrogram 高度）
  const distances = merges.map((m) => m.distance);
  rec
    .begin({
      zh: `${merges.length} 次合并的距离（树状图高度）`,
      en: `${merges.length} merge distances (dendrogram heights)`,
    })
    .setBars(rec.barsFrom(distances))
    .commit();

  // 最终聚类
  const palette: BarRole[] = ['compare', 'final', 'frontier'];
  rec
    .begin({ zh: `切成 3 簇`, en: `Cut into 3 clusters` })
    .setBars(
      rec.barsFrom(
        labels.map((l) => l + 1),
        labels.reduce<Record<number, BarRole>>((acc, l, i) => {
          acc[i] = palette[l % palette.length]!;
          return acc;
        }, {}),
      ),
    )
    .setAux([{ label: `簇数`, value: String(new Set(labels).size) }])
    .commit();

  // 简易树状图（合并树）
  const buildDendro = (merges: { a: number; b: number; distance: number }[]): TreeNode | null => {
    // 维护每个 id → TreeNode
    const nodes = new Map<number, TreeNode>();
    for (let i = 0; i < points.length; i++) {
      nodes.set(i, { id: `n${i}`, value: i, role: 'default', children: [] });
    }
    let nextId = points.length;
    for (const m of merges) {
      const left = nodes.get(m.a);
      const right = nodes.get(m.b);
      const parent: TreeNode = {
        id: `m${nextId}`,
        value: m.distance,
        role: 'pivot',
        children: [left, right].filter((x): x is TreeNode => x !== null && x !== undefined),
      };
      nodes.set(m.a, parent);
      nodes.delete(m.b);
      nextId++;
    }
    // 剩余根
    const roots = [...nodes.values()];
    return roots[0] ?? null;
  };
  const tree = buildDendro(merges);
  if (tree) {
    rec.begin({ zh: `合并树（树状图）`, en: `Merge tree (dendrogram)` }).setTree(tree).commit();
  }

  return rec.build();
}
