// =============================================================================
// 隐式 Treap · 录制帧序列
// 用 setTree 展示：构建 → 区间反转。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildImplicit,
  implicitReverse,
  toArray,
  resetSeed,
  type ITreapNode,
  type ImplicitTreapHooks,
} from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7];
export const DEFAULT_RANGE: [number, number] = [1, 5]; // 反转 [1,5]

/** ITreapNode → viz TreeNode（value 显示为「值/位置」）。 */
function toViz(node: ITreapNode | null, role: BarRole = 'default', prefix = 'n'): TreeNode | null {
  if (!node) return null;
  const id = `${prefix}-${node.value}`;
  return {
    id,
    value: String(node.value),
    role,
    children: [node.left, node.right]
      .map((c, i) => toViz(c, role, `${id}-${i}`) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
}

export function buildTrace(
  input: readonly number[] = DEFAULT_INPUT,
  range: [number, number] = DEFAULT_RANGE,
): Frame[] {
  const rec = new TraceRecorder();
  resetSeed(20240601);

  const snap = (
    note: { zh: string; en: string },
    r: ITreapNode | null,
    role: BarRole = 'default',
  ): void => {
    rec
      .begin(note)
      .setTree(toViz(r, role) ?? { id: 'empty', value: '∅' })
      .setAux([{ label: '序列', value: `[${toArray(r).join(', ')}]`, role: 'final' as BarRole }])
      .commit();
  };

  snap({ zh: '空序列', en: 'Empty sequence' }, null);

  const hooks: ImplicitTreapHooks = {};
  const root = buildImplicit(input, hooks);
  snap(
    {
      zh: `构建序列：[${input.join(', ')}]`,
      en: `Build sequence: [${input.join(', ')}]`,
    },
    root,
    'final',
  );

  // 区间反转
  const [lo, hi] = range;
  const reversed = implicitReverse(root, lo, hi, {
    onReverse: (v) => {
      snap({ zh: `翻转节点 ${v} 的 children`, en: `Flip children of node ${v}` }, reversed, 'swap');
    },
  });
  snap(
    {
      zh: `反转区间 [${lo}, ${hi}] → 序列 [${toArray(reversed).join(', ')}]`,
      en: `Reverse [${lo}, ${hi}] → sequence [${toArray(reversed).join(', ')}]`,
    },
    reversed,
    'final',
  );

  return rec.build();
}
