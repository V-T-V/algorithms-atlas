// =============================================================================
// 打家劫舍 III · 录制帧序列
import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { robTree, buildTree, type RobTreeHooks, type TreeNodeVal } from './impl.ts';

export const DEFAULT_INPUT: Array<number | null> = [3, 2, 3, null, 3, null, 1];

function toViz(node: TreeNodeVal | null, id: string): TreeNode | null {
  if (!node) return null;
  const children: TreeNode[] = [];
  const l = toViz(node.left, `${id}-L`);
  const r = toViz(node.right, `${id}-R`);
  if (l) children.push(l);
  if (r) children.push(r);
  return {
    id,
    value: node.value,
    role: 'final' as BarRole,
    children: children.length ? children : undefined,
  };
}

export function buildTrace(input: ReadonlyArray<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  const visits: Array<{ v: number; rob: number; notRob: number }> = [];
  let ans = 0;

  rec
    .begin({ zh: `输入树（层序）`, en: `Input tree (level-order)` })
    .setAux([
      {
        label: '层序',
        value: `[${input.map((x) => (x === null ? 'null' : `${x}`)).join(',')}]`,
        role: 'frontier',
      },
    ])
    .commit();

  if (root) {
    const viz = toViz(root, 'r');
    if (viz) {
      rec.begin({ zh: '原始树结构', en: 'Original tree' }).setTree(viz).commit();
    }
  }

  const hooks: RobTreeHooks = {
    onVisit: (v, rob, notRob) => {
      visits.push({ v, rob, notRob });
      rec
        .begin({
          zh: `访问节点 ${v}: rob=${rob} notRob=${notRob}`,
          en: `Visit ${v}: rob=${rob} notRob=${notRob}`,
        })
        .setAux([
          { label: `节点值`, value: String(v), role: 'pivot' },
          { label: '抢', value: String(rob), role: 'compare' },
          { label: '不抢', value: String(notRob), role: 'default' },
        ])
        .commit();
    },
    onDone: (b) => {
      ans = b;
    },
  };

  robTree(root, hooks);

  rec
    .begin({ zh: `完成：最大=${ans}`, en: `Done: best=${ans}` })
    .setAux([{ label: '最大收益', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
