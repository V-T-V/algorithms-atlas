// =============================================================================
// Floyd-Warshall 全源最短路 · 录制帧序列
// 通过 floydWarshall 的钩子把执行过程录成 Frame[]。
// 可视化：setGrid 渲染距离矩阵 D[i][j]，role 标当前松弛的 (i,j) 与中转行/列 k；setAux 注释。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floydWarshall, type DistMatrix, type FloydWarshallHooks } from './impl.ts';

const INF = Infinity;

/** 演示用图（4 个节点 A,B,C,D），含一条可被中转松弛的路径。 */
export const DEFAULT_INPUT: { labels: string[]; matrix: DistMatrix } = {
  labels: ['A', 'B', 'C', 'D'],
  // 行 i = 起点，列 j = 终点；i→j 的直接边权，对角线 0，无边 ∞
  matrix: [
    [0, 5, INF, 10],
    [INF, 0, 3, INF],
    [INF, INF, 0, 1],
    [INF, INF, INF, 0],
  ],
};

const fmt = (d: number): string => (Number.isFinite(d) ? String(d) : '∞');

/** 由距离矩阵生成网格快照。 */
function renderGrid(
  labels: string[],
  dist: ReadonlyArray<ReadonlyArray<number>>,
  curK: number | null,
  curI: number | null,
  curJ: number | null,
  highlightRelax: boolean,
): Cell[][] {
  // 顶部留一行/列做表头：实际我们渲染纯数字矩阵 + 用 role 着色
  const rows: Cell[][] = dist.map((row, i) =>
    row.map((v, j) => {
      let role: BarRole = 'default';
      if (curK !== null && (i === curK || j === curK)) role = 'frontier';
      if (curI === i && curJ === j) role = highlightRelax ? 'final' : 'compare';
      return { v: fmt(v), role };
    }),
  );
  return rows;
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { labels: string[]; matrix: DistMatrix } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const labels = input.labels;
  // 维护一份「当前距离矩阵」镜像，供渲染
  const dist: number[][] = input.matrix.map((row) => [...row]);
  let curK: number | null = null;
  let curI: number | null = null;
  let curJ: number | null = null;
  let highlightRelax = false;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid(labels, dist, curK, curI, curJ, highlightRelax))
      .setAux([
        { label: '矩阵 D[i][j]', value: 'i→j 当前最短距离', role: 'pivot' },
        ...(curK !== null
          ? [
              {
                label: `中转 k=${labels[curK]}`,
                value: `允许经 ${labels[curK]!} 中转`,
                role: 'frontier' as BarRole,
              },
            ]
          : []),
      ])
      .commit();
    highlightRelax = false;
  };

  snapshot({
    zh: `初始邻接矩阵（${labels.length} 节点，对角线=0，无边=∞）`,
    en: `Initial adjacency matrix (${labels.length} nodes; diag=0, no edge=∞)`,
  });

  const hooks: FloydWarshallHooks = {
    onIterate: (k) => {
      curK = k;
      snapshot({
        zh: `阶段 k=${labels[k]}：允许经 ${labels[k]} 作为中转节点松弛路径`,
        en: `Phase k=${labels[k]}: allow paths via ${labels[k]}`,
      });
    },
    onRelax: (i, j, k, oldDist, newDist, relaxed) => {
      curI = i;
      curJ = j;
      highlightRelax = relaxed;
      if (relaxed) {
        dist[i]![j] = newDist;
        snapshot({
          zh: `D[${labels[i]}][${labels[j]}]：经 ${labels[k]} 中转更优（${fmt(oldDist)} → ${fmt(newDist)}）`,
          en: `D[${labels[i]}][${labels[j]}]: via ${labels[k]} is better (${fmt(oldDist)} → ${fmt(newDist)})`,
        });
      }
    },
    onIterateEnd: (k) => {
      curI = null;
      curJ = null;
      snapshot({
        zh: `阶段 k=${labels[k]} 结束`,
        en: `Phase k=${labels[k]} done`,
      });
    },
  };

  const result = floydWarshall(input.matrix, hooks);

  // 终态：全部 final
  curK = null;
  curI = null;
  curJ = null;
  rec
    .begin({ zh: '全源最短路计算完成', en: 'All-pairs shortest paths computed' })
    .setGrid(result.dist.map((row) => row.map((v) => ({ v: fmt(v), role: 'final' as BarRole }))))
    .setAux([{ label: '结果', value: 'D[i][j] = i→j 最短距离', role: 'final' }])
    .commit();

  return rec.build();
}
