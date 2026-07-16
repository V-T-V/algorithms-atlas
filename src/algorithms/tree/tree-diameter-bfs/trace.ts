// =============================================================================
// 树直径（双 BFS）· 录制帧序列
// 用 setGraph 渲染邻接表树（链式结构），高亮两轮 BFS 与最终直径路径。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeDiameterBfs } from './impl.ts';

// 用一条链状树作为默认示例（直径 = 链长）
// 结构：0-1-2-3-4-5（直径 5）
export const DEFAULT_INPUT: number[][] = [[1], [0, 2], [1, 3], [2, 4], [3, 5], [4]];

/** 把邻接表树布局为一条水平链做近似定位（通用树用力导向由播放器决定）。 */
function layout(adj: number[][]): Map<number, { x: number; y: number }> {
  const n = adj.length;
  const pos = new Map<number, { x: number; y: number }>();
  if (n === 0) return pos;
  // BFS 层序定位：x = 序号归一化, y = 深度归一化
  const dist = new Array<number>(n).fill(-1);
  const queue: number[] = [0];
  dist[0] = 0;
  let head = 0;
  const order: number[] = [];
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    order.push(u);
    for (const w of adj[u]!) {
      if (dist[w] === -1) {
        dist[w] = dist[u]! + 1;
        queue.push(w);
      }
    }
  }
  const maxDist = Math.max(1, ...dist);
  order.forEach((u, i) => {
    pos.set(u, {
      x: 0.1 + 0.8 * (i / Math.max(1, order.length - 1)),
      y: 0.15 + 0.7 * (1 - dist[u]! / maxDist),
    });
  });
  return pos;
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const pos = layout(input);
  const visited1 = new Set<number>();
  const visited2 = new Set<number>();
  let highlightPath: number[] = [];
  let phase: 1 | 2 = 1;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.map((_, u) => {
      const p = pos.get(u) ?? { x: 0.5, y: 0.5 };
      let role: BarRole = 'default';
      if (highlightPath.includes(u)) role = 'final';
      else if (phase === 1 && visited1.has(u)) role = 'frontier';
      else if (phase === 2 && visited2.has(u)) role = 'frontier';
      return { id: String(u), label: String(u), x: p.x, y: p.y, role };
    });
    const edges: GraphEdge[] = [];
    const seen = new Set<string>();
    for (let u = 0; u < input.length; u++) {
      for (const w of input[u]!) {
        const key = u < w ? `${u}-${w}` : `${w}-${u}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const inPath =
          highlightPath.includes(u) &&
          highlightPath.includes(w) &&
          Math.abs(highlightPath.indexOf(u) - highlightPath.indexOf(w)) === 1;
        edges.push({ from: String(u), to: String(w), role: inPath ? 'final' : 'default' });
      }
    }
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({
    zh: `初始树（${input.length} 个节点），求直径`,
    en: `Initial tree (${input.length} nodes); find diameter`,
  });

  const result = treeDiameterBfs(input, {
    onVisit: (node) => {
      (phase === 1 ? visited1 : visited2).add(node);
    },
    onFarthest1: (u, du) => {
      phase = 2;
      render({
        zh: `第一轮 BFS 最远点 u=${u}（距离 ${du}）`,
        en: `BFS #1 farthest u=${u} (dist ${du})`,
      });
    },
    onFarthest2: (v, dv) => {
      render({
        zh: `第二轮 BFS 最远点 v=${v}（距离 ${dv}）`,
        en: `BFS #2 farthest v=${v} (dist ${dv})`,
      });
    },
    onDone: (_d, path) => {
      highlightPath = path;
      render({
        zh: `直径 = ${_d}，路径 ${path.join('→')}`,
        en: `Diameter = ${_d}, path ${path.join('→')}`,
      });
    },
  });

  void result;
  return rec.build();
}
