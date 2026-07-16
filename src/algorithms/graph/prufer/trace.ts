// =============================================================================
// Prüfer 编码 · 录制帧序列
// 可视化：setGraph（树），role:已删叶子='final'，当前删除叶子='pivot'，
// 记录的邻居='compare'，仍存活='frontier'。setAux 展示当前序列。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { prufer, type GraphInput, type PruferHooks } from './impl.ts';

/** 演示树（7 节点）：
 *     1
 *    /|\
 *   2 3 4
 *  /|
 * 5 6
 * |
 * 7
 * Prüfer 编码约 [5,6,2,1,1]（每次删最小叶子）。 */
export const DEFAULT_INPUT: GraphInput = {
  n: 7,
  edges: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 2, to: 6 },
    { from: 5, to: 7 },
  ],
};

const POS: Record<number, { x: number; y: number }> = {
  1: { x: 0.45, y: 0.2 },
  2: { x: 0.22, y: 0.5 },
  3: { x: 0.45, y: 0.5 },
  4: { x: 0.68, y: 0.5 },
  5: { x: 0.1, y: 0.82 },
  6: { x: 0.34, y: 0.82 },
  7: { x: 0.1, y: 0.98 },
};

const key = (i: number): string => String(i);

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const ids = Array.from({ length: input.n }, (_, i) => key(i + 1));

  const deleted = new Set<string>();
  let curLeaf: string | null = null;
  let curNeighbor: string | null = null;
  const code: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = ids.map((id) => {
      let role: BarRole = 'default';
      if (deleted.has(id)) role = 'final';
      if (id === curNeighbor) role = 'compare';
      if (id === curLeaf) role = 'pivot';
      return { id, label: id, x: POS[Number(id)]?.x ?? 0.5, y: POS[Number(id)]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges
      .filter((e) => !deleted.has(key(e.from)) && !deleted.has(key(e.to)))
      .map((e) => ({ from: key(e.from), to: key(e.to), role: 'default' }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '序列', value: code.length ? code.join(', ') : '∅', role: 'pivot' }])
      .commit();
  };

  render({ zh: `初始树（${input.n} 节点）`, en: `Initial tree (${input.n} nodes)` });

  const hooks: PruferHooks = {
    onDeleteLeaf: (leaf, neighbor, step) => {
      curLeaf = key(leaf);
      curNeighbor = key(neighbor);
      code.push(neighbor);
      render({
        zh: `第 ${step} 步：删最小叶子 ${leaf}，记录邻居 ${neighbor}`,
        en: `Step ${step}: remove min leaf ${leaf}, record neighbor ${neighbor}`,
      });
      deleted.add(key(leaf));
      curLeaf = null;
      curNeighbor = null;
    },
    onCode: (c) => {
      render({ zh: `Prüfer 序列 = [${c.join(', ')}]`, en: `Prüfer code = [${c.join(', ')}]` });
    },
  };

  prufer(input, hooks);

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      ids.map((id) => ({
        id,
        label: id,
        x: POS[Number(id)]?.x ?? 0.5,
        y: POS[Number(id)]?.y ?? 0.5,
        role: (deleted.has(id) ? 'final' : 'default') as BarRole,
      })),
      [],
    )
    .setAux([{ label: 'Prüfer 序列', value: `[${code.join(', ')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
