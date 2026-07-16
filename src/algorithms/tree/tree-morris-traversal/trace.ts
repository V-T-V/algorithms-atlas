// =============================================================================
// Morris 遍历 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { morrisInorder, buildTree, type BTNode, type MorrisHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 6, 1, 3, 5, 7];

function toViz(
  node: BTNode | null,
  visited: Set<number>,
  current: number | null,
  prefix = 'n',
): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const role: BarRole =
    node.value === current ? 'compare' : visited.has(node.value) ? 'final' : 'default';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, visited, current, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  const visited = new Set<number>();
  let current: number | null = null;
  const order: number[] = [];
  let threads = 0;

  rec
    .begin({ zh: 'Morris 中序遍历（O(1) 空间）', en: 'Morris in-order (O(1) space)' })
    .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
    .setAux([{ label: '活跃线索', value: '0', role: 'pivot' }])
    .commit();

  const hooks: MorrisHooks = {
    onThread: (pred, cur) => {
      threads++;
      current = cur;
      rec
        .begin({ zh: `建线索：前驱 ${pred} → ${cur}`, en: `Thread: pred ${pred} → ${cur}` })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .setAux([{ label: '活跃线索', value: String(threads), role: 'warn' }])
        .commit();
    },
    onUnthread: (pred, cur) => {
      threads--;
      current = cur;
      rec
        .begin({ zh: `断线索：前驱 ${pred} ↛ ${cur}`, en: `Unthread: pred ${pred} ↛ ${cur}` })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .setAux([{ label: '活跃线索', value: String(threads), role: 'frontier' }])
        .commit();
    },
    onVisit: (v) => {
      current = v;
      order.push(v);
      rec
        .begin({
          zh: `访问 ${v}（已序：${order.join('→')}）`,
          en: `Visit ${v} (${order.join('→')})`,
        })
        .setTree(toViz(root, visited, current) ?? { id: 'empty', value: '∅' })
        .setAux([{ label: '活跃线索', value: String(threads), role: 'pivot' }])
        .commit();
      visited.add(v);
    },
  };

  morrisInorder(root, hooks);

  rec
    .begin({
      zh: `完成：${order.join('→')}（线索全部还原）`,
      en: `Done: ${order.join('→')} (threads restored)`,
    })
    .setTree(toViz(root, visited, null) ?? { id: 'empty', value: '∅' })
    .setAux([{ label: '活跃线索', value: '0', role: 'final' }])
    .commit();

  return rec.build();
}
