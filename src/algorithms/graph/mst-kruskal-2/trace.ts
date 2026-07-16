// =============================================================================
// 次小生成树 · 录制帧序列
// 可视化：setGraph（无向图），role:MST 边='final'，当前考察='compare'，
// 替换尝试='pivot'，非树边='warn'。setAux 展示 MST 权与次小权。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mstKruskal2, type GraphInput, type MstKruskal2Hooks } from './impl.ts';

/** 演示图：
 *   1 -2- 2
 *   |1    |3
 *   4 -5- 3   外加 1-3(4) 非树边
 *   MST = 1+2+3 = 6（边 1-2, 1-4, 2-3）
 *   非树边：4-3(5)、1-3(4)
 *   候选：换 1-3(4) 替掉环 1-2-3 中最大边 2-3(3) → 6-3+4=7
 *        换 4-3(5) 替掉环 4-1-2-3 中最大边 2-3(3) → 6-3+5=8
 *   次小 MST = 7 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4'],
  edges: [
    { from: '1', to: '2', weight: 2 },
    { from: '1', to: '4', weight: 1 },
    { from: '2', to: '3', weight: 3 },
    { from: '3', to: '4', weight: 5 },
    { from: '1', to: '3', weight: 4 },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.25 },
  '2': { x: 0.8, y: 0.25 },
  '3': { x: 0.8, y: 0.78 },
  '4': { x: 0.2, y: 0.78 },
};

const ekey = (a: string, b: string): string => [a, b].sort().join('|');

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const mstEdgeSet = new Set<string>();
  let curEdge: { from: string; to: string } | null = null;
  let swapEdge: { from: string; to: string } | null = null;
  let mstWeight = 0;
  let secondWeight = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: 'default' as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => {
      const k = ekey(e.from, e.to);
      let role: BarRole = 'default';
      if (mstEdgeSet.has(k)) role = 'final';
      if (swapEdge && ekey(swapEdge.from, swapEdge.to) === k) role = 'pivot';
      if (curEdge && ekey(curEdge.from, curEdge.to) === k) role = 'compare';
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'MST 权', value: mstWeight ? String(mstWeight) : '—', role: 'final' },
        { label: '次小权', value: secondWeight ? String(secondWeight) : '—', role: 'pivot' },
      ])
      .commit();
  };

  render({ zh: '初始无向图', en: 'Initial undirected graph' });

  const hooks: MstKruskal2Hooks = {
    onEdge: (e, added) => {
      curEdge = { from: e.from, to: e.to };
      render({
        zh: `考察 ${e.from}-${e.to}(w=${e.weight})：${added ? '加入 MST' : '跳过（成环）'}`,
        en: `Consider ${e.from}-${e.to}(w=${e.weight}): ${added ? 'add to MST' : 'skip (cycle)'}`,
      });
      if (added) mstEdgeSet.add(ekey(e.from, e.to));
      curEdge = null;
    },
    onMst: (tw) => {
      mstWeight = tw;
      render({ zh: `MST 完成，权 = ${tw}`, en: `MST done, weight = ${tw}` });
    },
    onTrySwap: (e, mx, cand) => {
      swapEdge = { from: e.from, to: e.to };
      render({
        zh: `非树边 ${e.from}-${e.to}(w=${e.weight}) 替换环中最大边 w=${mx}，候选权 ${cand}`,
        en: `Non-tree edge ${e.from}-${e.to}(w=${e.weight}) swaps max ring edge w=${mx}, candidate ${cand}`,
      });
      swapEdge = null;
    },
    onDone: (sw, exists) => {
      secondWeight = sw;
      render({
        zh: `完成，次小 MST 权 = ${exists ? sw : '不存在'}`,
        en: `Done, second MST weight = ${exists ? sw : 'N/A'}`,
      });
    },
  };

  const result = mstKruskal2(input, hooks);
  void result;

  return rec.build();
}
