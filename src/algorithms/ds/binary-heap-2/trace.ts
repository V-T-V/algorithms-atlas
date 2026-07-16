// =============================================================================
// 二项堆 · 录制帧序列
// 用 setTree 展示森林（多棵二项树挂在虚拟根 "BINOMIAL" 下）。
// link 的胜者标 'final'，败者标 'swap'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BinomialHeap, type BinomialHeapHooks, type BinomialNode } from './impl.ts';

export const DEFAULT_INPUT = {
  build: [7, 2, 9, 4, 1, 8, 3, 5, 6],
  extract: 5,
};

let nodeId = 0;
function resetIds(): void {
  nodeId = 0;
}

function toViz(
  node: BinomialNode,
  hotWinner: number | null,
  hotLoser: number | null,
  minVal: number | null,
): TreeNode {
  const id = `bn-${nodeId++}`;
  let role: BarRole | undefined;
  if (node.value === hotWinner) role = 'final';
  else if (node.value === hotLoser) role = 'swap';
  else if (node.value === minVal) role = 'pivot';
  return {
    id,
    value: node.value,
    role,
    children:
      node.children.length > 0
        ? node.children.map((c) => toViz(c, hotWinner, hotLoser, minVal))
        : undefined,
  };
}

function forestToViz(
  heap: BinomialHeap,
  hotWinner: number | null,
  hotLoser: number | null,
): TreeNode {
  resetIds();
  const minVal = heap.findMin() ?? null;
  const roots = heap.roots();
  const children: TreeNode[] = [];
  for (const r of roots) {
    children.push({
      id: `root-${r.value}-${r.degree}`,
      value: `B${r.degree}:${r.value}`,
      role: 'compare',
      children: [toViz(r, hotWinner, hotLoser, minVal)],
    });
  }
  return {
    id: 'BINOMIAL',
    value: `森林(${roots.length}棵)`,
    role: 'default',
    children,
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { build: readonly number[]; extract: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const heap = new BinomialHeap();

  let hotWinner: number | null = null;
  let hotLoser: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setTree(forestToViz(heap, hotWinner, hotLoser))
      .commit();
    hotWinner = null;
    hotLoser = null;
  };

  rec
    .begin({ zh: '空二项堆', en: 'Empty binomial heap' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  const hooks: BinomialHeapHooks = {
    onLink: (w, l) => {
      hotWinner = w;
      hotLoser = l;
    },
    onInsert: () => {
      /* snapshot 统一展示 */
    },
  };

  // 阶段 1：插入
  for (const v of input.build) {
    heap.insert(v, hooks);
    snapshot({
      zh: `insert(${v})：B0 入森林并进位合并${hotWinner ? `（${hotLoser} 并入 ${hotWinner}）` : ''}`,
      en: `insert(${v}): B0 merged into forest${hotWinner ? ` (${hotLoser} linked under ${hotWinner})` : ''}`,
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
      zh: `extractMin → ${out}（子树反序并入森林）`,
      en: `extractMin → ${out} (children reversed and merged)`,
    });
  }

  // 终态
  rec
    .begin({
      zh: `完成；堆内 ${heap.size} 个元素，弹出序列 [${popped.join(', ')}]`,
      en: `Done; ${heap.size} elements left, extracted [${popped.join(', ')}]`,
    })
    .setTree(forestToViz(heap, null, null))
    .commit();

  return rec.build();
}
