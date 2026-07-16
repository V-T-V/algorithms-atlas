// =============================================================================
// 强连通分量（Kosaraju）· 录制帧序列
// 可视化：setGraph（节点+边），role: 同一 SCC 同色 'final'，第二次 DFS 种子='pivot'，当前='compare'；
// setAux 展示完成序栈与 SCC 列表。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stronglyConnected, type GraphInput, type KosarajuHooks } from './impl.ts';

/** 演示用有向图：含两个环 + 一条桥接边（与 tarjan-scc 同构，便于对比）。
 *  环 1：0→1→2→0；环 2：3→4→5→3；4→1 桥接。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
    { from: '4', to: '1' },
  ],
};

/** 归一化坐标：环 1 在左，环 2 在右。 */
const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.2, y: 0.3 },
  '1': { x: 0.2, y: 0.55 },
  '2': { x: 0.2, y: 0.8 },
  '3': { x: 0.7, y: 0.3 },
  '4': { x: 0.7, y: 0.55 },
  '5': { x: 0.7, y: 0.8 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const finishStack: string[] = [];
  const sccOf = new Map<string, number>();
  const done = new Set<string>();
  let curSeed: string | null = null;
  let sccCount = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (done.has(id)) role = 'final';
      if (id === curSeed) role = 'pivot';
      return {
        id,
        label: `${id}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (sccOf.has(e.from) && sccOf.get(e.from) === sccOf.get(e.to)) role = 'final';
      return { from: e.from, to: e.to, directed: true, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        {
          label: '完成序栈 / finish stack',
          value: finishStack.length ? finishStack.join(' → ') : '∅',
          role: 'frontier',
        },
        { label: '已发现 SCC 数', value: String(sccCount), role: 'final' },
      ])
      .commit();
  };

  render({
    zh: '初始有向图（两个环 + 桥接边）',
    en: 'Initial directed graph (two cycles + bridge)',
  });

  const hooks: KosarajuHooks = {
    onFinish: (v) => {
      finishStack.push(v);
      render({
        zh: `第一次 DFS 完成 ${v}，入栈`,
        en: `First DFS finishes ${v}, push to finish stack`,
      });
    },
    onComponentStart: (seed) => {
      curSeed = seed;
      render({
        zh: `第二次 DFS（反图）：种子 ${seed} 开始搜索新 SCC`,
        en: `Second DFS (reverse graph): seed ${seed} starts a new SCC`,
      });
    },
    onComponent: (comp) => {
      sccCount++;
      for (const id of comp) {
        sccOf.set(id, sccCount);
        done.add(id);
      }
      curSeed = null;
      render({
        zh: `发现 SCC #${sccCount}：{ ${comp.join(', ')} }`,
        en: `SCC #${sccCount} found: { ${comp.join(', ')} }`,
      });
    },
  };

  stronglyConnected(input, hooks);

  // 终态
  curSeed = null;
  rec
    .begin({
      zh: `完成：共 ${sccCount} 个强连通分量`,
      en: `Done: ${sccCount} strongly connected components`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        directed: true,
        role: (sccOf.get(e.from) === sccOf.get(e.to) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: 'SCC 总数', value: String(sccCount), role: 'final' }])
    .commit();

  return rec.build();
}
