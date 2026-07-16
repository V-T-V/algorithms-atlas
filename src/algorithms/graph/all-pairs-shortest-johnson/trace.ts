// =============================================================================
// 全源最短路（含路径）· 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPairsShortestPath, reconstructPath, type GraphInput, type ApshHooks } from './impl.ts';

/** 示例：4 顶点带权图。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'C', to: 'D', weight: 2 },
  ],
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { nodes } = input;
  const n = nodes.length;
  const INF = Infinity;

  let curK = -1;
  let curI = -1;
  let curJ = -1;
  let dist: number[][] = [];
  let finalDist: number[][] | null = null;

  const fmtCell = (v: number): string | number => (v === INF ? '∞' : v);

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: 'i\\j', role: 'default' },
      ...nodes.map((id) => ({ v: id, role: 'pivot' as BarRole })),
    ];
    const grid: Cell[][] = [header];
    const show = finalDist ?? dist;
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: nodes[i]!, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (finalDist) role = 'final';
        else if (curK >= 0 && i === curI && j === curJ) role = 'compare';
        else if (curK >= 0 && (i === curK || j === curK)) role = 'frontier';
        row.push({ v: fmtCell(show[i]![j]!), role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  // 初始化网格
  dist = Array.from({ length: n }, (_, i) => {
    const r = new Array<number>(n).fill(INF);
    r[i] = 0;
    return r;
  });
  snap({ zh: '初始距离矩阵（对角 0，邻接按边权）', en: 'Initial distance matrix' });

  const hooks: ApshHooks = {
    onInit: (d) => {
      dist = d.map((r) => [...r]);
      snap({ zh: '读入边权后的初始矩阵', en: 'Matrix after loading edges' });
    },
    onRelax: (k, i, j, nd) => {
      curK = k;
      curI = i;
      curJ = j;
      dist[i]![j] = nd;
      snap({
        zh: `k=${nodes[k]}: dist[${nodes[i]}][${nodes[j]}] → ${nd}（经 ${nodes[k]}）`,
        en: `k=${nodes[k]}: dist[${nodes[i]}][${nodes[j]}] -> ${nd} (via ${nodes[k]})`,
      });
    },
    onResult: (d) => {
      finalDist = d.map((r) => [...r]);
      curK = -1;
      snap({ zh: '完成：所有点对最短距离', en: 'Done: all-pairs shortest distances' });
    },
  };

  const result = allPairsShortestPath(input, hooks);

  // 展示一条示例路径
  if (n >= 2) {
    const path = reconstructPath(result.next, nodes, 0, n - 1);
    rec
      .begin({
        zh: `示例路径 ${nodes[0]}→${nodes[n - 1]}：${path ? path.join('→') : '不可达'}`,
        en: `Path ${nodes[0]}->${nodes[n - 1]}: ${path ? path.join('->') : 'unreachable'}`,
      })
      .setGrid(renderGrid())
      .setAux([
        {
          label: `${nodes[0]}→${nodes[n - 1]}`,
          value: String(result.dist[0]![n - 1]!),
          role: 'final',
        },
      ])
      .commit();
  }

  return rec.build();
}
