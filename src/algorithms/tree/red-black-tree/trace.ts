// =============================================================================
// 红黑树 · 录制帧序列
// 用 setTree 展示树的当前形态；红节点 role='pivot'，黑节点 role='default'。
// 录制策略：每插入一个值就重建一次快照；旋转/重着色时记录 note。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RedBlackTree, type RBHooks, type RBNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 15, 25, 5, 1];

/** 把 RBNode 转成 viz 用的 TreeNode（带唯一 id；role: 红=pivot, 黑=default）。 */
function toViz(node: RBNode | null, prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole = node.color === 'RED' ? 'pivot' : 'default';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new RedBlackTree();
  // 收集本轮插入事件（一次 insert 内可能有多次旋转/重着色）
  let rotateNotes: Array<{ zh: string; en: string }> = [];
  let recolorNotes: Array<{ zh: string; en: string }> = [];
  let fixCase: number | null = null;

  const _hooks: RBHooks = {
    onRotate: (type, pivot) => {
      rotateNotes.push({
        zh: `${type === 'L' ? '左' : '右'}旋（围绕 ${pivot}）`,
        en: `${type === 'L' ? 'Left' : 'Right'} rotate (around ${pivot})`,
      });
    },
    onRecolor: (nodeValue, from, to) => {
      recolorNotes.push({
        zh: `${nodeValue}: ${from === 'RED' ? '红' : '黑'} → ${to === 'RED' ? '红' : '黑'}`,
        en: `${nodeValue}: ${from} → ${to}`,
      });
    },
    onFixCase: (caseNo) => {
      fixCase = caseNo;
    },
  };

  rec
    .begin({ zh: '空树，开始插入', en: 'Empty tree, start inserting' })
    .setTree({ id: 'empty', value: '∅' })
    .commit();

  for (const v of input) {
    rotateNotes = [];
    recolorNotes = [];
    fixCase = null;
    // 增量插入 v（fixInsert 就地修改树）；插完即快照当前形态
    tree.insert(v);

    const parts: string[] = [];
    if (fixCase !== null) parts.push(`Case ${fixCase}`);
    const noteZh = parts.length
      ? `插入 ${v}：触发修复（${parts.join('、')}）${rotateNotes.length ? '；' + rotateNotes.map((r) => r.zh).join('，') : ''}`
      : `插入 ${v}（根直接染黑或无须修复）`;
    const noteEn = parts.length
      ? `Insert ${v}: fix-up (${parts.join(', ')})${rotateNotes.length ? '; ' + rotateNotes.map((r) => r.en).join(', ') : ''}`
      : `Insert ${v} (root blackened or no fix-up needed)`;

    rec
      .begin({ zh: noteZh, en: noteEn })
      .setTree(toViz(tree.root) ?? { id: 'empty', value: '∅' })
      .commit();
  }

  // 终态：黑节点 final，红节点保持 pivot 以区分
  const markFinal = (n: RBNode | null): TreeNode | null => {
    if (!n) return null;
    return {
      id: `f-${n.value}`,
      value: n.value,
      role: n.color === 'RED' ? ('pivot' as BarRole) : ('final' as BarRole),
      children: [n.left, n.right]
        .map((c) => markFinal(c) ?? undefined)
        .filter((x): x is TreeNode => x !== undefined),
    };
  };
  rec
    .begin({ zh: '红黑树构建完成（黑高平衡）', en: 'Red-Black tree built (black-height balanced)' })
    .setTree(markFinal(tree.root) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}
