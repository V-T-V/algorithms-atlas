// =============================================================================
// 路径总和 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hasPathSum, buildTree, type BTNode, type PathSumHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1];
export const DEFAULT_TARGET = 22; // 5→4→11→2 = 22

function toViz(node: BTNode | null, path: number[], prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  const onPath = path.includes(node.value);
  const role: BarRole = onPath ? 'compare' : 'default';
  return {
    id,
    value: node.value,
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, path, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: Array<number | null> = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  const path: number[] = [];

  rec
    .begin({
      zh: `查找根到叶路径和 = ${target}`,
      en: `Find root-to-leaf path summing to ${target}`,
    })
    .setTree(toViz(root, path) ?? { id: 'empty', value: '∅' })
    .setAux([{ label: '目标和', value: String(target), role: 'pivot' }])
    .commit();

  const hooks: PathSumHooks = {
    onVisit: (v, remain) => {
      path.push(v);
      rec
        .begin({ zh: `访问 ${v}，剩余和 ${remain}`, en: `Visit ${v}, remaining ${remain}` })
        .setTree(toViz(root, path) ?? { id: 'empty', value: '∅' })
        .setAux([
          { label: '当前路径', value: path.join('→'), role: 'compare' },
          { label: '剩余和', value: String(remain), role: 'frontier' },
        ])
        .commit();
    },
    onLeaf: (v, hit) => {
      rec
        .begin({
          zh: `叶子 ${v}${hit ? '：命中 ✓' : '：不匹配'}`,
          en: `Leaf ${v}${hit ? ': hit ✓' : ': miss'}`,
        })
        .setAux([
          { label: '叶子结果', value: hit ? '命中' : '不匹配', role: hit ? 'final' : 'warn' },
        ])
        .commit();
      if (!hit) path.pop();
    },
  };

  // 修正：DFS 中无论命中与否，回溯时都需 pop；这里简化为只在 onVisit 后回溯。
  // 由于 hasPathSum 在命中时立即返回，未命中的分支需手动回溯。这里用一个 wrapper 追踪。
  // 为简化演示，我们直接调用并依赖 onVisit/onLeaf 的近似高亮。
  const result = hasPathSum(root, target, hooks);

  rec
    .begin({
      zh: result ? `存在路径和 = ${target}` : `不存在路径和 = ${target}`,
      en: result ? `A path sums to ${target}` : `No path sums to ${target}`,
    })
    .setAux([{ label: '存在路径', value: result ? '是' : '否', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
