// =============================================================================
// 欧拉回路判定（数学）· 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerCircuitExists, type GraphInput, type EulerExistHooks } from './impl.ts';

/** 示例：A-B-C-D-A 矩形 + B-D 对角线，所有度数偶 → 存在。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
    { from: 'B', to: 'D' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.25 },
  B: { x: 0.8, y: 0.25 },
  C: { x: 0.8, y: 0.8 },
  D: { x: 0.2, y: 0.8 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const reachable = new Set<string>();
  const visited = new Set<string>();
  let result: boolean | null = null;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (reachable.has(id)) role = 'frontier';
      if (visited.has(id)) role = 'compare';
      if (result !== null) role = result ? 'final' : 'warn';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        {
          label: '结论',
          value: result === null ? '判定中' : result ? '存在欧拉回路' : '不存在',
          role: result === false ? 'warn' : 'final',
        },
      ])
      .commit();
  };

  snap({ zh: '初始图：判定欧拉回路存在性', en: 'Initial: decide Euler circuit existence' });

  const hooks: EulerExistHooks = {
    onCheck: (crit, ok) => {
      snap({
        zh: `判据「${crit}」：${ok ? '通过' : '不通过'}`,
        en: `Check "${crit}": ${ok ? 'pass' : 'fail'}`,
      });
    },
    onResult: (exists, reason) => {
      result = exists;
      snap({
        zh: exists ? '存在欧拉回路' : `不存在：${reason}`,
        en: exists ? 'Exists' : `No: ${reason}`,
      });
    },
  };

  eulerCircuitExists(input, hooks);

  rec
    .begin({ zh: result ? '存在' : '不存在', en: result ? 'Exists' : 'Not exists' })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '结论', value: result ? '存在' : '不存在', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
