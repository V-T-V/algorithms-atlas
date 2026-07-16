// BST 区间查询 · 录制帧序列
// 用 setTree 展示访问路径：在区间内 compare/final、被剪枝 warn、未碰 default。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bstRange, bstInsert, type BSTNode, type RangeHooks } from './impl.ts';

export const DEFAULT_INPUT = { insert: [50, 30, 70, 20, 40, 60, 80], lo: 35, hi: 65 };

function toViz(
  node: BSTNode | null,
  inRange: Set<number>,
  pruned: Set<number>,
  current: number | null,
  lo: number,
  hi: number,
  prefix = 'n',
): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  let role: BarRole = 'default';
  if (node.value === current) role = 'compare';
  else if (inRange.has(node.value)) role = 'final';
  else if (pruned.has(node.value)) role = 'warn';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, inRange, pruned, current, lo, hi, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: { insert?: number[]; lo?: number; hi?: number } = {}): Frame[] {
  const { insert = [50, 30, 70, 20, 40, 60, 80], lo = 35, hi = 65 } = input;
  const rec = new TraceRecorder();
  const root = bstInsert(insert);
  const inRange = new Set<number>();
  const pruned = new Set<number>();
  let current: number | null = null;

  rec
    .begin({
      zh: `初始 BST，查询区间 [${lo}, ${hi}]`,
      en: `Initial BST, query range [${lo}, ${hi}]`,
    })
    .setTree(toViz(root, inRange, pruned, current, lo, hi) ?? { id: 'empty', value: '∅' })
    .commit();

  const result: number[] = [];
  const hooks: RangeHooks = {
    onVisit: (v, ir) => {
      current = v;
      if (ir) {
        inRange.add(v);
        result.push(v);
      }
      rec
        .begin({
          zh: `访问 ${v}（${ir ? '在区间内' : '区间外'}，当前结果 [${result.join(', ')}]）`,
          en: `Visit ${v} (${ir ? 'in range' : 'out of range'}, result [${result.join(', ')}])`,
        })
        .setTree(toViz(root, inRange, pruned, current, lo, hi) ?? { id: 'empty', value: '∅' })
        .commit();
    },
    onPrune: (v, side) => {
      pruned.add(v);
      rec
        .begin({
          zh: `剪掉 ${v} 的${side === 'left' ? '左' : '右'}子树（整棵都在区间外）`,
          en: `Prune ${v}'s ${side} subtree (entirely out of range)`,
        })
        .setTree(toViz(root, inRange, pruned, current, lo, hi) ?? { id: 'empty', value: '∅' })
        .commit();
    },
  };

  bstRange(root, lo, hi, hooks);

  rec
    .begin({
      zh: `区间查询完成：[${result.join(', ')}]`,
      en: `Range query done: [${result.join(', ')}]`,
    })
    .setTree(toViz(root, inRange, pruned, null, lo, hi) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}
