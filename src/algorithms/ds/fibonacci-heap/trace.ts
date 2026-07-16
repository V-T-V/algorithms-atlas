// =============================================================================
// 斐波那契堆 · 录制帧序列
// 用 setTree 展示根表森林（多棵挂在虚拟根 "FIB" 下），节点值标注度数。
// link 涉及节点标 'compare'，min 标 'pivot'，根表条目标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FibonacciHeap, type FibHooks, type FibNode } from './impl.ts';

export const DEFAULT_INPUT = {
  build: [7, 2, 9, 4, 1, 8, 3, 5, 6],
  extract: 5,
};

let nodeSeq = 0;

/** 把一个 FibNode 子树转成 viz（child 为其子链表）。 */
function nodeToViz(node: FibNode, linkHot: number | null, minVal: number | null): TreeNode {
  const id = `fib-${nodeSeq++}`;
  let role: BarRole | undefined;
  if (node.value === linkHot) role = 'compare';
  else if (node.value === minVal) role = 'pivot';
  const children: TreeNode[] = [];
  let c = node.child;
  if (c) {
    const start = c;
    do {
      children.push(nodeToViz(c, linkHot, minVal));
      c = c.right;
    } while (c !== start);
  }
  return {
    id,
    value: `${node.value}·d${node.degree}`,
    role,
    children: children.length ? children : undefined,
  };
}

function heapToViz(heap: FibonacciHeap, linkHot: number | null): TreeNode {
  nodeSeq = 0;
  const minVal = heap.findMin() ?? null;
  const roots = heap.rootList();
  const children: TreeNode[] = [];
  for (const r of roots) {
    children.push({
      id: `root-${nodeSeq++}`,
      value: `根`,
      role: 'final',
      children: [nodeToViz(r, linkHot, minVal)],
    });
  }
  return {
    id: 'FIB',
    value: `根表(${roots.length})`,
    role: 'default',
    children,
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { build: readonly number[]; extract: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const heap = new FibonacciHeap();

  let linkHot: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setTree(heapToViz(heap, linkHot)).commit();
    linkHot = null;
  };

  rec
    .begin({ zh: '空斐波那契堆', en: 'Empty Fibonacci heap' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  const hooks: FibHooks = {
    onLink: (_w, loser) => {
      linkHot = loser;
    },
  };

  // 阶段 1：插入（O(1) 加入根表）
  for (const v of input.build) {
    heap.insert(v, hooks);
    snapshot({
      zh: `insert(${v})：O(1) 加入根表，min = ${heap.findMin()}`,
      en: `insert(${v}): O(1) added to root list, min = ${heap.findMin()}`,
    });
  }

  // 阶段 2：连续 extractMin（consolidate 按 degree 合并）
  const popped: number[] = [];
  for (let k = 0; k < input.extract; k++) {
    const minVal = heap.findMin();
    if (minVal === undefined) break;
    snapshot({ zh: `准备弹出最小值 ${minVal}`, en: `About to extract min ${minVal}` });
    const out = heap.extractMin(hooks);
    if (out !== undefined) popped.push(out);
    snapshot({
      zh: `extractMin → ${out}（子节点并入根表后 consolidate）`,
      en: `extractMin → ${out} (children merged, then consolidate)`,
    });
  }

  // 终态
  rec
    .begin({
      zh: `完成；堆内 ${heap.size} 个元素，弹出 [${popped.join(', ')}]`,
      en: `Done; ${heap.size} left, extracted [${popped.join(', ')}]`,
    })
    .setTree(heapToViz(heap, null))
    .commit();

  return rec.build();
}
