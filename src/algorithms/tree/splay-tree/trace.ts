// =============================================================================
// 伸展树 · 录制帧序列
// 用 setTree 展示树形态。每次插入（及随之的 splay 步骤）后重建快照。
// 当前刚 splay 的根标 'final'，正在旋转涉及的节点标 'compare'。
// 录制策略：对输入前缀 [0..k] 逐次插入，借 hooks 捕获 splay 事件并实时录像。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SplayTree, type SplayHooks, type SplayNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 25, 5];

/** 把 SplayNode 转成 viz 用的 TreeNode（带唯一 id）。hotValue 高亮。 */
function toViz(node: SplayNode | null, hotValue: number | null, isRoot: boolean): TreeNode | null {
  if (!node) return null;
  let role: BarRole | undefined;
  if (hotValue !== null && node.value === hotValue) role = 'compare';
  else if (isRoot) role = 'final';
  return {
    id: `n-${node.value}`,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c) => toViz(c, hotValue, false) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tree = new SplayTree();
  let hotValue: number | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const root = toViz(tree.getRoot(), hotValue, true) ?? { id: 'empty', value: '∅' };
    rec
      .begin(note)
      .setTree(root)
      .setAux([{ label: '节点数', value: String(tree.size), role: 'final' }])
      .commit();
  };

  render({ zh: '空树，开始插入', en: 'Empty tree, start inserting' });

  const hooks: SplayHooks = {
    onCompare: () => {},
    onInsert: (value) => {
      hotValue = value;
      render({ zh: `插入 ${value}（BST 定位）`, en: `Insert ${value} (BST positioning)` });
    },
    onSplay: (type, xValue) => {
      hotValue = xValue;
      const typeZh =
        type === 'zig' ? 'zig（单旋）' : type === 'zig-zig' ? 'zig-zig（同侧）' : 'zig-zag（异侧）';
      render({
        zh: `splay ${typeZh}：把 ${xValue} 上提`,
        en: `splay ${type} (around ${xValue}): lift ${xValue}`,
      });
    },
    onSplayDone: (value) => {
      hotValue = value;
      render({ zh: `${value} 已成为根`, en: `${value} is now the root` });
      hotValue = null;
    },
  };

  for (const v of input) {
    tree.insert(v, hooks);
  }

  // 查找演示：一个存在、一个不存在，观察 splay 仍把节点提到根
  const probeExist = input[Math.floor(input.length / 2)] ?? input[0]!;
  const probeMissing = 9999;
  tree.search(probeExist, hooks);
  tree.search(probeMissing, hooks);

  // 终态：标记根为 final，其余 default
  const markFinal = (n: SplayNode | null, isRoot: boolean): TreeNode | null => {
    if (!n) return null;
    return {
      id: `f-${n.value}`,
      value: n.value,
      role: isRoot ? 'final' : undefined,
      children: [n.left, n.right]
        .map((c) => markFinal(c, false) ?? undefined)
        .filter((x): x is TreeNode => x !== undefined),
    };
  };
  rec
    .begin({
      zh: `伸展树构建完成（根=${tree.getRoot()?.value}，共 ${tree.size} 节点）`,
      en: `Splay tree built (root=${tree.getRoot()?.value}, ${tree.size} nodes)`,
    })
    .setTree(markFinal(tree.getRoot(), true) ?? { id: 'empty', value: '∅' })
    .commit();

  return rec.build();
}
