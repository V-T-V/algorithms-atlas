// 顺序统计树选第 k 小 · 录制帧序列
// 用 setTree 展示带 size 的 BST，用 setAux 展示 OS-Select 的访问路径。

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildOST, osSelect, type OSTHooks, type OSTNode } from './impl.ts';

export const DEFAULT_INPUT = { arr: [15, 6, 18, 3, 10, 13, 20, 8], k: 5 };

/** 把 OSTNode 转成 viz 用的 TreeNode（label = value(size)）。 */
function toViz(node: OSTNode | null, prefix = 'n', highlightValue: number | null): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  return {
    id,
    value: `${node.value}(${node.size})`,
    role: node.value === highlightValue ? 'pivot' : 'default',
    children: [node.left, node.right]
      .map((c, i) => toViz(c, `${id}-${i}`, highlightValue) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  let highlight: number | null = null;
  const pathNotes: string[] = [];

  const snapshot = (note: { zh: string; en: string }, tree: OSTNode | null): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'k (1-based)', value: String(k), role: 'pivot' as BarRole },
      { label: '路径', value: pathNotes.join(' → ') || '∅', role: 'frontier' as BarRole },
      { label: '树大小', value: String(tree?.size ?? 0), role: 'compare' as BarRole },
    ];
    rec
      .begin(note)
      .setTree(toViz(tree, 'n', highlight) ?? { id: 'empty', value: '∅' })
      .setAux(aux)
      .commit();
  };

  // 阶段一：逐元素插入建树
  for (let i = 0; i < arr.length; i++) {
    const slice = arr.slice(0, i + 1);
    const tree = buildOST(slice);
    snapshot(
      {
        zh: `插入 ${arr[i]}（共 ${slice.length} 个）`,
        en: `Insert ${arr[i]} (${slice.length} total)`,
      },
      tree,
    );
  }

  const tree = buildOST(arr);

  // 阶段二：OS-Select 找第 k 小
  snapshot({ zh: `开始 OS-Select：找第 ${k} 小`, en: `OS-Select: find rank-${k}` }, tree);

  const selectHooks: OSTHooks = {
    onVisit: (value, leftSize, decision) => {
      highlight = value;
      pathNotes.push(`${value}(r=${leftSize + 1},${decision})`);
      snapshot(
        {
          zh: `访问 ${value}：左子树 ${leftSize}，r=${leftSize + 1}，决策 ${decision}`,
          en: `Visit ${value}: leftSize ${leftSize}, r=${leftSize + 1}, ${decision}`,
        },
        tree,
      );
    },
  };

  const ans = osSelect(tree, k, selectHooks);

  // 终态：标记命中节点
  highlight = ans;
  rec
    .begin({ zh: `第 ${k} 小 = ${ans}`, en: `Rank-${k} smallest = ${ans}` })
    .setTree(toViz(tree, 'f', ans) ?? { id: 'empty', value: '∅' })
    .setAux([
      { label: '结果', value: String(ans), role: 'final' as BarRole },
      { label: '访问节点数', value: String(pathNotes.length), role: 'frontier' as BarRole },
      { label: '复杂度', value: 'O(h)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
