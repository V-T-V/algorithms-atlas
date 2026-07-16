// 恢复 BST · 录制帧序列
// 演示：先构造一棵合法 BST，再人为交换两个节点制造损坏，然后调用 bstRecover 修复。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bstRecover, buildTree, swapValues, type BSTNode, type RecoverHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 一棵合法 BST：中序 [1,2,3,4,5,6,7]
  level: [4, 2, 6, 1, 3, 5, 7],
  swap: [2, 6] as [number, number],
};

function cloneTree(node: BSTNode | null): BSTNode | null {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function toViz(
  node: BSTNode | null,
  visited: Set<number>,
  anomalies: Set<number>,
  swapped: Set<number>,
  current: number | null,
  prefix = 'n',
): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}-${visited.size}`;
  let role: BarRole = 'default';
  if (node.value === current) role = 'compare';
  else if (swapped.has(node.value)) role = 'pivot';
  else if (anomalies.has(node.value)) role = 'warn';
  else if (visited.has(node.value)) role = 'final';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, visited, anomalies, swapped, current, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: { level?: number[]; swap?: [number, number] } = {}): Frame[] {
  const { level = [4, 2, 6, 1, 3, 5, 7], swap = [2, 6] } = input;
  const rec = new TraceRecorder();

  // 1. 构造一棵合法 BST
  const good = buildTree(level);
  // 2. 克隆并交换两个节点 → 损坏的 BST
  const broken = cloneTree(good);
  swapValues(broken, swap[0], swap[1]);

  const visited = new Set<number>();
  const anomalies = new Set<number>();
  const swappedSet = new Set<number>(swap);

  rec
    .begin({
      zh: `合法 BST，人为交换 ${swap[0]} 与 ${swap[1]} 制造损坏`,
      en: `Valid BST, manually swap ${swap[0]} and ${swap[1]} to break it`,
    })
    .setTree(toViz(broken, visited, anomalies, swappedSet, null) ?? { id: 'empty', value: '∅' })
    .commit();

  let current: number | null = null;
  const hooks: RecoverHooks = {
    onVisit: (v) => {
      current = v;
      visited.add(v);
      rec
        .begin({
          zh: `中序访问 ${v}`,
          en: `Inorder visit ${v}`,
        })
        .setTree(
          toViz(broken, visited, anomalies, swappedSet, current) ?? { id: 'empty', value: '∅' },
        )
        .commit();
    },
    onAnomaly: (prev, curr) => {
      anomalies.add(prev);
      anomalies.add(curr);
      rec
        .begin({
          zh: `发现逆序对：${prev} > ${curr}`,
          en: `Anomaly found: ${prev} > ${curr}`,
        })
        .setTree(
          toViz(broken, visited, anomalies, swappedSet, current) ?? { id: 'empty', value: '∅' },
        )
        .commit();
    },
  };

  const result = bstRecover(broken, hooks);

  // 修复后清空中间状态，仅保留 swapped 标记
  visited.clear();
  anomalies.clear();
  rec
    .begin({
      zh: `修复完成，交换回 ${result.swapped[0]} ↔ ${result.swapped[1]}，中序恢复递增`,
      en: `Recovered, swapped back ${result.swapped[0]} ↔ ${result.swapped[1]}, inorder ascending again`,
    })
    .setTree(
      toViz(broken, visited, anomalies, new Set(result.swapped), null) ?? {
        id: 'empty',
        value: '∅',
      },
    )
    .commit();

  return rec.build();
}
