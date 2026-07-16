// =============================================================================
// 打家劫舍 III · 录制
import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { robTree, type HouseRobberHooks, type TreeNode5 } from './impl.ts';

export const DEFAULT_INPUT: TreeNode5 = {
  val: 3,
  left: { val: 2, right: { val: 3 } },
  right: { val: 3, right: { val: 1 } },
};

function toViz(node: TreeNode5 | null | undefined, active: number | null): TreeNode | null {
  if (!node) return null;
  const children: TreeNode[] = [];
  const l = toViz(node.left, active);
  const r = toViz(node.right, active);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id: `n-${node.val}-${Math.random().toString(36).slice(2, 6)}`,
    value: node.val,
    role: (node.val === active ? 'compare' : 'default') as BarRole,
    children: children.length ? children : undefined,
  };
}

export function buildTrace(root: TreeNode5 = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let active: number | null = null;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setTree(toViz(root, active) ?? { id: 'e', value: '∅' })
      .commit();
  };

  snap({ zh: '树形房屋', en: 'Tree of houses' });

  const hooks: HouseRobberHooks = {
    onVisit: (val, rob, notRob) => {
      active = val;
      snap({
        zh: `访问 ${val}: rob=${rob}, notRob=${notRob}`,
        en: `Visit ${val}: rob=${rob} notRob=${notRob}`,
      });
      active = null;
    },
  };

  const ans = robTree(root, hooks);

  rec
    .begin({ zh: `最大收益=${ans}`, en: `Max loot=${ans}` })
    .setAux([{ label: '最优', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
