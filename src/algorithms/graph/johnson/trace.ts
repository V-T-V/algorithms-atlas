// =============================================================================
// Johnson 全源最短路 · 录制帧序列
// 可视化：setAux 展示 Bellman-Ford 求得的势能 h / 重赋权过程；
//        setGrid 展示最终全源距离矩阵。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { johnson, type GraphInput, type JohnsonHooks } from './impl.ts';

/** 演示用有向图（含负权边）。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4'],
  directed: true,
  edges: [
    { from: '0', to: '1', weight: 4 },
    { from: '0', to: '2', weight: 1 },
    { from: '2', to: '1', weight: 2 },
    { from: '1', to: '3', weight: 1 },
    { from: '2', to: '3', weight: 5 },
    { from: '3', to: '4', weight: 3 },
    { from: '4', to: '2', weight: -1 }, // 负权边
  ],
};

const INF = '∞';
const fmt = (v: number): string | number => (Number.isFinite(v) ? v : INF);

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const n = nodeIds.length;

  // 势能表（Bellman-Ford 阶段）+ 最终距离矩阵
  const h = new Map<string, number>(nodeIds.map((id) => [id, 0]));
  const distMatrix: Array<Array<number>> = Array.from({ length: n }, () =>
    new Array<number>(n).fill(Infinity),
  );
  let bellmanRound = 0;
  let dijkstraSrc: string | null = null;
  const reweightedEdges = new Map<string, number>();

  const hAux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    {
      label: '势能 h / potential',
      value: nodeIds.map((id) => `${id}:${fmt(h.get(id) ?? Infinity)}`).join('  '),
      role: 'frontier',
    },
    { label: 'Bellman 轮次 / round', value: bellmanRound > 0 ? String(bellmanRound) : '—' },
    { label: '当前 Dijkstra 源', value: dijkstraSrc ?? '—', role: 'compare' },
  ];

  const renderDistGrid = (note: { zh: string; en: string }): void => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: 'u\\v', role: 'default' }];
    for (const v of nodeIds) header.push({ v, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i < n; i++) {
      const u = nodeIds[i]!;
      const row: Cell[] = [{ v: u, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (u === dijkstraSrc && nodeIds[j] === dijkstraSrc) role = 'pivot';
        else if (u === dijkstraSrc) role = 'frontier';
        const val = distMatrix[i]![j]!;
        row.push({ v: fmt(val), role });
      }
      grid.push(row);
    }
    rec.begin(note).setGrid(grid).setAux(hAux()).commit();
  };

  renderDistGrid({
    zh: 'Johnson：加超级源点，势能 h 初始化为 0',
    en: 'Johnson: add super source, init h=0',
  });

  const hooks: JohnsonHooks = {
    onInit: () => {},
    onBellmanRound: (round) => {
      bellmanRound = round;
    },
    onBellmanRelax: (from, to, newDist, improved) => {
      if (improved) h.set(to, newDist);
    },
    onNegativeCycle: () => {
      rec
        .begin({ zh: '检测到负权环，无法重赋权', en: 'Negative cycle detected, cannot reweight' })
        .setAux([{ label: '结果', value: '存在负环 / has negative cycle', role: 'warn' }])
        .commit();
    },
    onReweighted: (hMap) => {
      for (const [k, v] of hMap) h.set(k, v);
      // 展示重赋权后的边权
      const lines: string[] = [];
      for (const e of input.edges) {
        const wp = e.weight + (h.get(e.from) ?? 0) - (h.get(e.to) ?? 0);
        reweightedEdges.set(`${e.from}→${e.to}`, wp);
        lines.push(`${e.from}→${e.to}:${e.weight}→${fmt(wp)}`);
      }
      rec
        .begin({
          zh: `重赋权完成：w'(u,v)=w+h(u)-h(v) ≥ 0`,
          en: `Reweighting done: w'(u,v)=w+h(u)-h(v) >= 0`,
        })
        .setAux([
          {
            label: '势能 h / potential',
            value: nodeIds.map((id) => `${id}:${fmt(h.get(id) ?? Infinity)}`).join('  '),
            role: 'frontier',
          },
          { label: '重赋权边', value: lines.join('  '), role: 'final' },
        ])
        .commit();
    },
    onDijkstraSource: (s) => {
      dijkstraSrc = s;
    },
    onDone: () => {},
  };

  const result = johnson(input, hooks);

  // 填入最终距离矩阵
  if (!result.hasNegativeCycle) {
    for (let i = 0; i < n; i++) {
      const u = nodeIds[i]!;
      const row = result.dist.get(u) ?? new Map<string, number>();
      for (let j = 0; j < n; j++) {
        distMatrix[i]![j] = row.get(nodeIds[j]!) ?? Infinity;
      }
    }
  }
  dijkstraSrc = null;
  bellmanRound = 0;

  renderDistGrid({
    zh: result.hasNegativeCycle ? '存在负环' : '完成：全源最短距离矩阵',
    en: result.hasNegativeCycle ? 'Has negative cycle' : 'Done: all-pairs distance matrix',
  });

  return rec.build();
}
