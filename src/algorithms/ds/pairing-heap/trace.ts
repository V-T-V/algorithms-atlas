// =============================================================================
// 配对堆 · 录制帧序列
// 用 setTree 展示配对堆树形态（first-child/next-sibling → 转成多叉树）。
// meld 中标 'compare'，新根标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PairingHeap, type PairingHooks, type PairingNode } from './impl.ts';

export const DEFAULT_INPUT = {
  build: [7, 2, 9, 4, 1, 8, 3, 5, 6],
  extract: 5,
};

let nodeSeq = 0;

/** 把 first-child/next-sibling 表示转成多叉树 viz。 */
function toViz(node: PairingNode | null, hot: number | null): TreeNode | null {
  if (!node) return null;
  // 收集子节点
  const children: TreeNode[] = [];
  let c = node.child;
  while (c) {
    const cv = toViz(c, hot);
    if (cv) children.push(cv);
    c = c.sibling;
  }
  const role: BarRole | undefined = node.value === hot ? 'compare' : undefined;
  return {
    id: `ph-${nodeSeq++}`,
    value: node.value,
    role,
    children: children.length ? children : undefined,
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { build: readonly number[]; extract: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const heap = new PairingHeap();

  let hot: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeSeq = 0;
    rec
      .begin(note)
      .setTree(toViz(heap.root, hot) ?? { id: 'empty', value: '∅' })
      .commit();
    hot = null;
  };

  rec
    .begin({ zh: '空配对堆', en: 'Empty pairing heap' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  const hooks: PairingHooks = {
    onMeld: (w) => {
      hot = w;
    },
  };

  // 阶段 1：插入
  for (const v of input.build) {
    heap.insert(v, hooks);
    snapshot({
      zh: `insert(${v})：meld 后根 = ${heap.findMin()}`,
      en: `insert(${v}): root after meld = ${heap.findMin()}`,
    });
  }

  // 阶段 2：连续 extractMin（两两配对 + 左到右合并）
  const popped: number[] = [];
  for (let k = 0; k < input.extract; k++) {
    const minVal = heap.findMin();
    if (minVal === undefined) break;
    snapshot({ zh: `准备弹出最小值 ${minVal}`, en: `About to extract min ${minVal}` });
    const out = heap.extractMin(hooks);
    if (out !== undefined) popped.push(out);
    snapshot({
      zh: `extractMin → ${out}（子链两两配对后合并）`,
      en: `extractMin → ${out} (children two-pass paired)`,
    });
  }

  // 终态
  nodeSeq = 0;
  const markFinal = (node: PairingNode | null): TreeNode | null => {
    if (!node) return null;
    const children: TreeNode[] = [];
    let c = node.child;
    while (c) {
      const cv = markFinal(c);
      if (cv) children.push(cv);
      c = c.sibling;
    }
    return {
      id: `f-${nodeSeq++}`,
      value: node.value,
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
