// =============================================================================
// 树形 DP · 录制帧序列
// 用 setTree 展示带权树：选中节点 'final'、未选 'default'、当前处理 'compare'。
// 用 setAux 展示每个节点的 dpPick / dpSkip。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeDp, type TreeDpHooks, type TreeDpInput } from './impl.ts';

/** 演示用带权树。 */
export const DEFAULT_INPUT: TreeDpInput = {
  root: '1',
  nodes: [
    { id: '1', weight: 3, children: ['2', '3'] },
    { id: '2', weight: 2, children: ['4', '5'] },
    { id: '3', weight: 5, children: ['6'] },
    { id: '4', weight: 1 },
    { id: '5', weight: 4 },
    { id: '6', weight: 1 },
  ],
};

/** 由 TreeDpInput 构造可绘制的 TreeNode。 */
function buildTree(input: TreeDpInput, picked: Set<string>, focus: string | null): TreeNode | null {
  const nodeOf = new Map(input.nodes.map((n) => [n.id, n]));
  const make = (id: string): TreeNode | null => {
    const n = nodeOf.get(id);
    if (!n) return null;
    let role: BarRole = 'default';
    if (picked.has(id)) role = 'final';
    if (id === focus) role = 'compare';
    const children = (n.children ?? [])
      .map((c) => make(c))
      .filter((x): x is TreeNode => x !== null);
    return { id, value: `${id}:w${n.weight}`, children, role };
  };
  return make(input.root);
}

/** 录制演示帧序列。 */
export function buildTrace(input: TreeDpInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const picked = new Set<string>();
  const dpPick = new Map<string, number>();
  const dpSkip = new Map<string, number>();
  let focus: string | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const tree = buildTree(input, picked, focus);
    if (!tree) {
      rec.begin(note).commit();
      return;
    }
    const aux = input.nodes.map((n) => ({
      label: `节点 ${n.id}`,
      value: `pick=${dpPick.has(n.id) ? dpPick.get(n.id) : '?'} / skip=${dpSkip.has(n.id) ? dpSkip.get(n.id) : '?'}`,
      role: (picked.has(n.id) ? 'final' : n.id === focus ? 'compare' : 'default') as BarRole,
    }));
    rec.begin(note).setTree(tree).setAux(aux).commit();
  };

  render({
    zh: `带权树：根 ${input.root}，求最大权独立集`,
    en: `Weighted tree, root ${input.root}; find max-weight independent set`,
  });

  const hooks: TreeDpHooks = {
    onEnter: (u, parent) => {
      focus = u;
      render({
        zh: `后序进入 ${u}（父 ${parent ?? '∅'}）`,
        en: `Post-order enter ${u} (parent ${parent ?? '∅'})`,
      });
    },
    onSolve: (u, pick, skip, choice) => {
      dpPick.set(u, pick);
      dpSkip.set(u, skip);
      focus = u;
      render({
        zh: `${u}：dpPick=${pick}，dpSkip=${skip} → 本节点决策 ${choice === 'pick' ? '选' : '不选（暂记）'}`,
        en: `${u}: dpPick=${pick}, dpSkip=${skip} → local choice ${choice}`,
      });
    },
    onDone: (_mw, pk) => {
      for (const id of pk) picked.add(id);
      focus = null;
    },
  };

  const result = treeDp(input, hooks);

  // 终态
  focus = null;
  const tree = buildTree(input, picked, null);
  rec
    .begin({
      zh: `最大权和 = ${result.maxWeight}，选中 ${result.picked.join(',')}`,
      en: `Max weight = ${result.maxWeight}, picked ${result.picked.join(',')}`,
    })
    .setTree(tree ?? { id: input.root, value: '', role: 'final' })
    .setAux([
      { label: '最大权和 / max weight', value: String(result.maxWeight), role: 'final' },
      { label: '选中集 / picked', value: result.picked.join(', '), role: 'frontier' },
    ])
    .commit();

  return rec.build();
}
