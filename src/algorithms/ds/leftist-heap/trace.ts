// =============================================================================
// 左偏树 · 录制帧序列
// 用 setTree 展示左偏树形态（节点值标注 s 值）。
// 交换发生时标记 'pivot'，根标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LeftistHeap, type LeftistHooks, type LeftistNode } from './impl.ts';

export const DEFAULT_INPUT = {
  build: [7, 2, 9, 4, 1, 8, 3, 5, 6],
  extract: 5,
};

let nodeSeq = 0;

function toViz(node: LeftistNode | null, swapNode: number | null): TreeNode | null {
  if (!node) return null;
  const id = `lh-${nodeSeq++}`;
  const role: BarRole | undefined = node.value === swapNode ? 'pivot' : undefined;
  const l = toViz(node.left, swapNode);
  const r = toViz(node.right, swapNode);
  const children: TreeNode[] = [];
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id,
    value: `${node.value}·s${node.s}`,
    role,
    children: children.length ? children : undefined,
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { build: readonly number[]; extract: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const heap = new LeftistHeap();

  let swapNode: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeSeq = 0;
    rec
      .begin(note)
      .setTree(toViz(heap.root, swapNode) ?? { id: 'empty', value: '∅' })
      .commit();
    swapNode = null;
  };

  rec
    .begin({ zh: '空左偏树', en: 'Empty leftist heap' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  const hooks: LeftistHooks = {
    onSwap: (v) => {
      swapNode = v;
    },
  };

  // 阶段 1：插入
  for (const v of input.build) {
    heap.insert(v, hooks);
    snapshot({
      zh: `insert(${v})${swapNode ? `：节点 ${swapNode} 交换左右维持左偏` : ''}`,
      en: `insert(${v})${swapNode ? `: node ${swapNode} swapped to keep leftist` : ''}`,
    });
  }

  // 阶段 2：连续 extractMin
  const popped: number[] = [];
  for (let k = 0; k < input.extract; k++) {
    const minVal = heap.findMin();
    if (minVal === undefined) break;
    snapshot({ zh: `准备弹出最小值 ${minVal}`, en: `About to extract min ${minVal}` });
    const out = heap.extractMin(hooks);
    if (out !== undefined) popped.push(out);
    snapshot({
      zh: `extractMin → ${out}（合并左右子树）`,
      en: `extractMin → ${out} (merge children)`,
    });
  }

  // 终态
  nodeSeq = 0;
  const markFinal = (n: LeftistNode | null): TreeNode | null => {
    if (!n) return null;
    const l = markFinal(n.left);
    const r = markFinal(n.right);
    const children: TreeNode[] = [];
    if (l) children.push(l);
    if (r) children.push(r);
    return {
      id: `f-${nodeSeq++}`,
      value: `${n.value}·s${n.s}`,
      role: 'final',
      children: children.length ? children : undefined,
    };
  };
  rec
    .begin({
      zh: `完成；堆内 ${heap.size} 个元素，弹出 [${popped.join(', ')}]，合法=${heap.isValid()}`,
      en: `Done; ${heap.size} left, extracted [${popped.join(', ')}], valid=${heap.isValid()}`,
    })
    .setTree(markFinal(heap.root) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}
