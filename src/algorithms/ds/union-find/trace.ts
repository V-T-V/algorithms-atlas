// =============================================================================
// 并查集 · 录制帧序列
// 通过 unionFind 的钩子，把执行过程录成 Frame[]。
// 用 setMap 展示「元素→根」字典，用 setGraph 展示合并森林。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { UnionFind, unionFind, type UnionFindHooks, type UnionFindOps } from './impl.ts';

/** 演示：8 个元素，执行一系列合并，演示连通分量的演化。 */
export const DEFAULT_INPUT: UnionFindOps = {
  elements: ['1', '2', '3', '4', '5', '6', '7', '8'],
  unions: [
    ['1', '2'],
    ['3', '4'],
    ['5', '6'],
    ['1', '4'], // 连通 {1,2,3,4}
    ['7', '8'],
    ['6', '8'], // 连通 {5,6,7,8}
    ['2', '7'], // 全连通
    ['3', '5'], // 已同根
  ],
};

/** 归一化坐标：两行均匀分布。 */
const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.3 },
  '2': { x: 0.4, y: 0.3 },
  '3': { x: 0.6, y: 0.3 },
  '4': { x: 0.8, y: 0.3 },
  '5': { x: 0.2, y: 0.75 },
  '6': { x: 0.4, y: 0.75 },
  '7': { x: 0.6, y: 0.75 },
  '8': { x: 0.8, y: 0.75 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: UnionFindOps = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const uf = new UnionFind(input.elements);

  const unionEdges: GraphEdge[] = [];
  let highlight: { a: string; b: string; merged: boolean } | null = null;
  let findPath: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    // 字典视图：元素 → 根
    const snap = uf.snapshot();
    const entries = input.elements.map((e) => ({
      key: e,
      value: snap.get(e) ?? e,
      role: (highlight && (highlight.a === e || highlight.b === e)
        ? 'compare'
        : findPath.includes(e)
          ? 'frontier'
          : 'default') as BarRole,
    }));
    // 图视图：合并森林（仅显示成功合并形成的父子边）
    const nodes: GraphNode[] = input.elements.map((id) => {
      let role: BarRole = 'default';
      if (highlight && (highlight.a === id || highlight.b === id)) role = 'compare';
      else if (findPath.includes(id)) role = 'frontier';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    rec
      .begin(note)
      .setMap(entries)
      .setGraph(nodes, unionEdges)
      .setAux([{ label: '连通分量数', value: String(uf.components()), role: 'final' }])
      .commit();
  };

  render({
    zh: `初始：${input.elements.length} 个独立元素`,
    en: `Init: ${input.elements.length} singleton sets`,
  });

  const hooks: UnionFindHooks = {
    onFind: (node, _root) => {
      findPath.push(node);
    },
    onUnion: (a, b, ra, rb, newRoot, merged) => {
      highlight = { a, b, merged };
      findPath = [];
      render({
        zh: merged
          ? `合并 ${a}、${b}：根 ${ra} ⋃ ${rb} → 新根 ${newRoot}`
          : `${a}、${b} 已同根 ${ra}，跳过`,
        en: merged
          ? `Union ${a}, ${b}: roots ${ra} ⋃ ${rb} → ${newRoot}`
          : `${a}, ${b} already share root ${ra}, skip`,
      });
      if (merged)
        unionEdges.push({
          from: newRoot === ra ? rb : ra,
          to: newRoot,
          directed: true,
          role: 'final',
        });
      highlight = null;
      findPath = [];
    },
  };

  unionFind(input, hooks);

  // 终态
  rec
    .begin({
      zh: `完成，共 ${uf.components()} 个连通分量`,
      en: `Done, ${uf.components()} component(s)`,
    })
    .setMap(
      input.elements.map((e) => ({
        key: e,
        value: uf.snapshot().get(e) ?? e,
        role: 'final' as BarRole,
      })),
    )
    .setGraph(
      input.elements.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      unionEdges.map((e) => ({ ...e, role: 'final' as BarRole })),
    )
    .commit();

  return rec.build();
}
