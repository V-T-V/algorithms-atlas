// =============================================================================
// K近邻 · 录制帧序列
// 用 setGraph 展示训练点+查询点（归一化坐标），K 个近邻高亮；
// setAux 展示距离排序与投票。
// =============================================================================

import type { BarRole, Frame, GraphNode, GraphEdge } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knn, type KnnHooks, type LabeledPoint } from './impl.ts';

export interface KnnInput {
  train: LabeledPoint[];
  query: { x: number; y: number };
  k: number;
}

export const DEFAULT_INPUT: KnnInput = {
  train: [
    { x: 1, y: 1, label: 'A' },
    { x: 1.5, y: 0.8, label: 'A' },
    { x: 2, y: 1.2, label: 'A' },
    { x: 8, y: 8, label: 'B' },
    { x: 9, y: 8.5, label: 'B' },
    { x: 8.5, y: 9, label: 'B' },
    { x: 4.5, y: 5, label: 'C' },
    { x: 5, y: 5.5, label: 'C' },
  ],
  query: { x: 3, y: 3 },
  k: 3,
};

/** 把所有点映射到 [0,1]×[0,1] 归一化坐标。 */
function normalize(
  all: Array<{ x: number; y: number }>,
  padding = 0.08,
): (p: { x: number; y: number }) => { x: number; y: number } {
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
  return (p) => ({
    x: padding + ((p.x - minX) / spanX) * (1 - 2 * padding),
    y: 1 - (padding + ((p.y - minY) / spanY) * (1 - 2 * padding)),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: KnnInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { train, query, k } = input;

  const all: Array<{ x: number; y: number }> = [...train, query];
  const norm = normalize(all);

  // 当前高亮的近邻集合（按训练点 index）
  let activeNeighbors = new Set<number>();
  let activePoint = -1;
  let resultLabel = '';

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = train.map((p, i) => {
      const np = norm(p);
      const role: BarRole = activeNeighbors.has(i)
        ? 'compare'
        : activePoint === i
          ? 'swap'
          : 'default';
      return {
        id: `t${i}`,
        label: `${p.label}${i}`,
        x: np.x,
        y: np.y,
        role,
      };
    });
    const nq = norm(query);
    nodes.push({
      id: 'q',
      label: `?`,
      x: nq.x,
      y: nq.y,
      role: resultLabel ? 'final' : 'pivot',
    });
    // 边：近邻到查询点
    const edges: GraphEdge[] = [...activeNeighbors].map((i) => ({
      from: `t${i}`,
      to: 'q',
      role: 'compare' as BarRole,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({
    zh: `查询点 (?, ?)，训练集 ${train.length} 个点，k=${k}`,
    en: `Query point ?, ${train.length} training points, k=${k}`,
  });

  const dists: Array<{ index: number; dist: number; label: string }> = [];

  const hooks: KnnHooks = {
    onDistance: (i, dist) => {
      activePoint = i;
      dists.push({ index: i, dist, label: train[i]!.label });
      const aux: Array<{ label: string; value: string; role?: BarRole }> = [
        { label: '计算中', value: `d(Q, t${i}) = ${dist.toFixed(2)}`, role: 'swap' as BarRole },
      ];
      rec
        .begin({
          zh: `计算 Q 到 t${i} 的距离 = ${dist.toFixed(2)}`,
          en: `d(Q, t${i}) = ${dist.toFixed(2)}`,
        })
        .setGraph(
          [
            ...train.map((p, j) => {
              const np = norm(p);
              return {
                id: `t${j}`,
                label: `${p.label}${j}`,
                x: np.x,
                y: np.y,
                role: (j === i ? 'swap' : 'default') as BarRole,
              };
            }),
            { id: 'q', label: '?', x: norm(query).x, y: norm(query).y, role: 'pivot' as BarRole },
          ],
          [{ from: `t${i}`, to: 'q', role: 'compare' as BarRole }],
        )
        .setAux(aux)
        .commit();
      activePoint = -1;
    },
    onSelectNeighbors: (neighbors) => {
      activeNeighbors = new Set(neighbors.map((nb) => nb.index));
      // 距离排序表
      const sorted = [...dists].sort((a, b) => a.dist - b.dist);
      const aux: Array<{ label: string; value: string; role?: BarRole }> = sorted.map((d, i) => ({
        label: `#${i + 1}`,
        value: `t${d.index} (${d.label}) d=${d.dist.toFixed(2)}`,
        role: (i < k ? 'compare' : 'default') as BarRole,
      }));
      rec
        .begin({
          zh: `取最近 ${k} 个邻居`,
          en: `Pick the ${k} nearest neighbors`,
        })
        .setAux(aux)
        .commit();
    },
    onVote: (i, neighborIndex, label, votes) => {
      const aux: Array<{ label: string; value: string; role?: BarRole }> = Object.entries(votes)
        .sort((a, b) => b[1] - a[1])
        .map(([lbl, c]) => ({
          label: lbl,
          value: `${c} 票`,
          role: 'frontier' as BarRole,
        }));
      aux.unshift({
        label: `邻居 #${i + 1}`,
        value: `t${neighborIndex} → ${label}`,
        role: 'compare' as BarRole,
      });
      rec
        .begin({
          zh: `邻居 t${neighborIndex}（类别 ${label}）投票`,
          en: `Neighbor t${neighborIndex} (label ${label}) votes`,
        })
        .setAux(aux)
        .commit();
    },
    onResult: (label, votes) => {
      resultLabel = label;
      const aux: Array<{ label: string; value: string; role?: BarRole }> = Object.entries(votes)
        .sort((a, b) => b[1] - a[1])
        .map(([lbl, c]) => ({
          label: lbl,
          value: `${c} 票`,
          role: (lbl === label ? 'final' : 'default') as BarRole,
        }));
      aux.unshift({
        label: '预测类别',
        value: label,
        role: 'final' as BarRole,
      });
      render({
        zh: `分类结果：${label}（${votes[label]} 票）`,
        en: `Predicted label: ${label} (${votes[label]} votes)`,
      });
      rec.begin({ zh: '完成', en: 'Done' }).setAux(aux).commit();
    },
  };

  knn(train, query, { k }, hooks);

  return rec.build();
}
