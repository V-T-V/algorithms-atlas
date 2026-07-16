// =============================================================================
// 圆方树 · 录制帧序列
// 可视化：setGraph（圆方树），role:方点='pivot'，割点（连多方）='final'，普通圆点='frontier'。
// setAux 展示方点 → 节点。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cdt, type CdtHooks, type GraphInput } from './impl.ts';

/** 演示无向图：两个三角环由桥 (2-3) 相连。
 *  VCC：{0,1,2}, {2,3}, {3,4,5} → 方点 S0,S1,S2；割点 2,3 各连两个方点。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.12, y: 0.2 },
  '1': { x: 0.12, y: 0.5 },
  '2': { x: 0.32, y: 0.35 },
  '3': { x: 0.55, y: 0.65 },
  '4': { x: 0.85, y: 0.4 },
  '5': { x: 0.85, y: 0.8 },
  S0: { x: 0.2, y: 0.35 },
  S1: { x: 0.43, y: 0.5 },
  S2: { x: 0.72, y: 0.6 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const origIds = input.nodes;

  // 渐进构建的圆方树
  const curNodes = new Set<string>(origIds);
  const curEdges: Array<{ from: string; to: string }> = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [...curNodes].map((id) => {
      const isSquare = id.startsWith('S');
      return {
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (isSquare ? 'pivot' : 'frontier') as BarRole,
      };
    });
    const edges: GraphEdge[] = curEdges.map((e) => ({
      from: e.from,
      to: e.to,
      role: 'final' as BarRole,
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '原图节点', value: origIds.join(', '), role: 'frontier' },
        { label: '方点数', value: String(curNodes.size - origIds.length), role: 'pivot' },
      ])
      .commit();
  };

  render({ zh: '原图节点（圆点）', en: 'Original vertices (circles)' });

  const hooks: CdtHooks = {
    onComponent: (comp) => {
      render({ zh: `发现点双 { ${comp.join(', ')} }`, en: `VCC { ${comp.join(', ')} }` });
    },
    onSquareNode: (sid, vertices) => {
      curNodes.add(sid);
      for (const v of vertices) curEdges.push({ from: v, to: sid });
      render({
        zh: `新建方点 ${sid}，连接 ${vertices.join(', ')}`,
        en: `Square ${sid} links ${vertices.join(', ')}`,
      });
    },
  };

  const result = cdt(input, hooks);

  rec
    .begin({
      zh: `圆方树构建完成：${result.treeEdges.length} 条圆-方边`,
      en: `Done: ${result.treeEdges.length} circle-square edges`,
    })
    .setGraph(
      result.treeNodes.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (id.startsWith('S') ? 'pivot' : 'final') as BarRole,
      })),
      result.treeEdges.map((e) => ({ from: e[0], to: e[1], role: 'final' as BarRole })),
    )
    .setAux([{ label: '方点数', value: String(result.squareOf.size), role: 'pivot' }])
    .commit();

  return rec.build();
}
