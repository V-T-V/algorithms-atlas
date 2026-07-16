// =============================================================================
// 第 K 短路 · 录制帧序列
// 可视化：setGraph（有向图），role:已选路径='final'，当前偏离搜索='compare'，
// 源='frontier'，汇='pivot'。setAux 展示已收集路径数与权重列表。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kShortest, type GraphInput, type KShortestHooks } from './impl.ts';

/** 演示图：
 *   s→a(1), s→b(5)
 *   a→b(1), a→t(6)
 *   b→t(1)
 *   s→t(100)（绕远）
 *   最短：s→a→b→t = 1+1+1 = 3
 *   次短：s→a→t = 1+6 = 7
 *   第三短：s→b→t = 5+1 = 6（实际 6 < 7，故次短=6，第三=7）
 *   第四：s→t = 100 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['s', 'a', 'b', 't'],
  edges: [
    { from: 's', to: 'a', weight: 1 },
    { from: 's', to: 'b', weight: 5 },
    { from: 'a', to: 'b', weight: 1 },
    { from: 'a', to: 't', weight: 6 },
    { from: 'b', to: 't', weight: 1 },
    { from: 's', to: 't', weight: 100 },
  ],
  source: 's',
  target: 't',
  k: 3,
};

const POS: Record<string, { x: number; y: number }> = {
  s: { x: 0.1, y: 0.5 },
  a: { x: 0.38, y: 0.22 },
  b: { x: 0.38, y: 0.78 },
  t: { x: 0.9, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const foundPaths: Array<{ path: string[]; weight: number }> = [];
  let curPath: string[] | null = null;
  let deviationEdges: Set<string> = new Set();

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (id === input.source) role = 'frontier';
      else if (id === input.target) role = 'pivot';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      const k = `${e.from}>${e.to}`;
      if (deviationEdges.has(k)) role = 'warn';
      if (curPath) {
        for (let i = 0; i + 1 < curPath.length; i++) {
          if (curPath[i] === e.from && curPath[i + 1] === e.to) role = 'compare';
        }
      }
      // 已选路径全部用 final 着色（每条边若属于任一已选路径）
      for (const fp of foundPaths) {
        for (let i = 0; i + 1 < fp.path.length; i++) {
          if (fp.path[i] === e.from && fp.path[i + 1] === e.to && role !== 'compare') {
            role = 'final';
          }
        }
      }
      return { from: e.from, to: e.to, directed: true, weight: e.weight, role };
    });
    const wList = foundPaths.map((p) => p.weight).join(', ');
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '已收集权重', value: wList || '∅', role: 'final' }])
      .commit();
  };

  render({
    zh: `初始图，源 ${input.source}，汇 ${input.target}，K=${input.k}`,
    en: `Initial graph, source ${input.source}, target ${input.target}, K=${input.k}`,
  });

  const hooks: KShortestHooks = {
    onPath: (i, path, w) => {
      foundPaths.push({ path, weight: w });
      curPath = path;
      render({
        zh: `第 ${i + 1} 短路：${path.join('→')}（权 ${w}）`,
        en: `Path #${i + 1}: ${path.join('->')} (w ${w})`,
      });
      curPath = null;
    },
    onDeviation: (spur, banned) => {
      deviationEdges = new Set(banned.map((e) => `${e.from}>${e.to}`));
      render({
        zh: `偏离搜索 spur=${spur}，禁用 ${banned.length} 边`,
        en: `Deviation at ${spur}, banned ${banned.length} edges`,
      });
      deviationEdges = new Set();
    },
    onDone: (c) => {
      render({ zh: `完成，共找到 ${c} 条路径`, en: `Done, found ${c} paths` });
    },
  };

  const result = kShortest(input, hooks);
  void result;

  return rec.build();
}
