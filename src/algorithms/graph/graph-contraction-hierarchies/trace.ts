// =============================================================================
// 层次收缩 (CH) · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { contractionHierarchiesQuery, type CHGraphInput, type CHHooks } from './impl.ts';

export const DEFAULT_INPUT: CHGraphInput = {
  nodes: ['S', 'A', 'B', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 1 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'T', weight: 1 },
    { from: 'S', to: 'T', weight: 10 },
  ],
  order: ['A', 'B', 'S', 'T'], // 先收缩中间节点
};
export const DEFAULT_SOURCE = 'S';
export const DEFAULT_TARGET = 'T';

export function buildTrace(
  input: CHGraphInput = DEFAULT_INPUT,
  source = DEFAULT_SOURCE,
  target = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  let ans = Infinity;

  const hooks: CHHooks = {
    onContract: (node, added) => {
      rec
        .begin({
          zh: `收缩 ${node}，新增 ${added} 条 shortcut`,
          en: `Contract ${node}, +${added} shortcuts`,
        })
        .setAux([
          { label: '收缩节点', value: node, role: 'pivot' },
          { label: '新增 shortcut', value: String(added), role: 'compare' },
        ])
        .commit();
    },
    onSettle: (side, node, dist) => {
      rec
        .begin({
          zh: `${side === 'fwd' ? '前向' : '反向'}定居 ${node}: d=${dist}`,
          en: `${side} settle ${node}: d=${dist}`,
        })
        .setAux([
          { label: '方向', value: side, role: 'frontier' },
          { label: '节点', value: node, role: 'pivot' },
          { label: '距离', value: String(dist), role: 'compare' },
        ])
        .commit();
    },
    onDone: (found, dist) => {
      ans = found ? dist : Infinity;
      rec
        .begin({
          zh: found ? `距离=${dist}` : '不可达',
          en: found ? `dist=${dist}` : 'unreachable',
        })
        .setAux([{ label: '最短距离', value: found ? String(dist) : '∞', role: 'final' }])
        .commit();
    },
  };

  contractionHierarchiesQuery(input, source, target, hooks);

  return rec.build();
}
