// =============================================================================
// 点分治 · 录制帧序列
// 可视化：setGraph（树），role:当前重心='pivot'，已分治='final'，当前块='frontier'；
// setAux 展示点分树与层数。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { centroidDecomp, type CentroidDecompHooks, type GraphInput } from './impl.ts';

/** 演示树（星形 + 链）：
 *   1 连 2,3,4；4 连 5,6,7。根 1。重心约为 1 或 4。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
    { from: '4', to: '6' },
    { from: '4', to: '7' },
  ],
  root: '1',
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.35, y: 0.4 },
  '2': { x: 0.12, y: 0.2 },
  '3': { x: 0.12, y: 0.6 },
  '4': { x: 0.6, y: 0.4 },
  '5': { x: 0.85, y: 0.2 },
  '6': { x: 0.85, y: 0.4 },
  '7': { x: 0.85, y: 0.6 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const removed = new Set<string>();
  const done = new Set<string>();
  const curBlock = new Set<string>();
  let centroid: string | null = null;
  let levels = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (done.has(id)) role = 'final';
      else if (curBlock.has(id)) role = 'frontier';
      if (id === centroid) role = 'pivot';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '已分治', value: done.size ? [...done].join(', ') : '∅', role: 'final' },
        { label: '层数', value: String(levels) },
      ])
      .commit();
  };

  render({ zh: '初始树', en: 'Initial tree' });

  const hooks: CentroidDecompHooks = {
    onBlock: (_r, block) => {
      curBlock.clear();
      block.forEach((b) => curBlock.add(b));
      render({ zh: `处理连通块（${block.length} 节点）`, en: `Process block (${block.length})` });
    },
    onCentroid: (c) => {
      centroid = c;
      render({ zh: `找到重心 ${c}`, en: `Centroid = ${c}` });
      done.add(c);
      removed.add(c);
      curBlock.delete(c);
    },
    onTreeEdge: (par, child) => {
      render({ zh: `点分树：${child} → 父 ${par}`, en: `Centroid tree: ${child} -> ${par}` });
    },
    onDone: (lv) => {
      levels = lv;
    },
  };

  const result = centroidDecomp(input, hooks);

  centroid = null;
  curBlock.clear();
  rec
    .begin({
      zh: `点分树根 = ${result.root}，共 ${levels} 层`,
      en: `Root = ${result.root}, ${levels} levels`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
    )
    .setAux([{ label: '点分树根', value: result.root, role: 'pivot' }])
    .commit();

  return rec.build();
}
