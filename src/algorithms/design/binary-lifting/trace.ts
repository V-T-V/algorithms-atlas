// =============================================================================
// 倍增 · 录制帧序列
// 用 setTree 渲染树，LCA 标 'final'，查询路径上的节点标 'compare'；
// setAux 展示倍增表 up[k][v] 的关键行。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { build, lca, type TreeInput } from './impl.ts';

/**
 * 演示树（7 节点）：
 *        R(0)
 *       / \
 *     A(1) B(2)
 *    / \     \
 *  C(3) D(4)  E(5)
 *   /
 *  F(6)
 *
 * LCA(C, D) = A；LCA(C, E) = R；LCA(F, E) = R；LCA(F, C) = C
 */
export const DEFAULT_INPUT: TreeInput = {
  nodes: ['R', 'A', 'B', 'C', 'D', 'E', 'F'],
  parents: ['R', 'R', 'R', 'A', 'A', 'B', 'C'],
  root: 'R',
};
/** 默认查询：LCA(C, E) = R。 */
export const DEFAULT_QUERY: [string, string] = ['C', 'E'];

interface TraceOptions {
  tree: TreeInput;
  query: [string, string];
}

/** 根据父节点表构造 viz 用的 TreeNode（根的 parent 视为自身）。 */
function buildVizTree(tree: TreeInput): { root: TreeNode; indexOf: Map<string, number> } {
  const nodes = [...tree.nodes];
  const indexOf = new Map<string, number>();
  nodes.forEach((id, i) => indexOf.set(id, i));
  // children 列表
  const children: number[][] = nodes.map(() => []);
  let rootIdx = 0;
  nodes.forEach((id, i) => {
    const p = tree.parents[i];
    if (p === undefined || p === id || p === '') {
      rootIdx = i;
    } else {
      const pi = indexOf.get(p);
      if (pi !== undefined && pi !== i) children[pi]!.push(i);
    }
  });
  const make = (i: number): TreeNode => ({
    id: nodes[i]!,
    value: nodes[i]!,
    role: 'default',
    children: children[i]!.map(make),
  });
  return { root: make(rootIdx), indexOf };
}

/** 在 viz 树上给指定节点集合打角色（递归）。 */
function markRoles(node: TreeNode, roles: Map<string, BarRole>): TreeNode {
  return {
    id: node.id,
    value: node.value,
    role: roles.get(node.id) ?? node.role ?? 'default',
    children: node.children?.map((c) => markRoles(c, roles)),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const tree = opts.tree ?? DEFAULT_INPUT;
  const query = opts.query ?? DEFAULT_QUERY;
  const [u, v] = query;
  const rec = new TraceRecorder();
  const bl = build(tree);
  const { root: vizRoot } = buildVizTree(tree);
  const roles = new Map<string, BarRole>();
  let phase = '对齐深度 / Align depth';

  const snapshot = (note: { zh: string; en: string }): void => {
    const marked = markRoles(vizRoot, roles);
    // aux：展示 up[k][u] 与 up[k][v] 的倍增表片段
    const aux = [
      {
        label: '阶段',
        value: phase,
        role: 'pivot' as BarRole,
      },
      {
        label: '查询',
        value: `LCA(${u}, ${v})`,
        role: 'frontier' as BarRole,
      },
      {
        label: `depth[${u}]`,
        value: String(bl.depth[bl.indexOf.get(u)!]),
        role: 'default' as BarRole,
      },
      {
        label: `depth[${v}]`,
        value: String(bl.depth[bl.indexOf.get(v)!]),
        role: 'default' as BarRole,
      },
    ];
    rec.begin(note).setTree(marked).setAux(aux).commit();
  };

  roles.set(u, 'compare');
  roles.set(v, 'compare');
  snapshot({
    zh: `查询 LCA(${u}, ${v})：depth[${u}]=${bl.depth[bl.indexOf.get(u)!]}，depth[${v}]=${bl.depth[bl.indexOf.get(v)!]}`,
    en: `Query LCA(${u}, ${v}): depth[${u}]=${bl.depth[bl.indexOf.get(u)!]}, depth[${v}]=${bl.depth[bl.indexOf.get(v)!]}`,
  });

  const result = lca(bl, u, v, {
    onLift: (nodeIdx) => {
      const id = bl.nodes[nodeIdx]!;
      roles.set(id, 'swap');
      snapshot({
        zh: `节点 ${id} 上跳 2^k 步`,
        en: `Node ${id} jumps up 2^k steps`,
      });
    },
    onAligned: (ui, vi) => {
      phase = '同层上跳 / Lift together';
      const idU = bl.nodes[ui]!;
      const idV = bl.nodes[vi]!;
      roles.set(idU, 'compare');
      roles.set(idV, 'compare');
      snapshot({
        zh: `深度对齐：${idU} 与 ${idV} 同层${idU === idV ? '，且相同 → 即为 LCA' : '，开始同层上跳'}`,
        en: `Depths aligned: ${idU} and ${idV} at same level${idU === idV ? ', and equal → this is the LCA' : ', start lifting together'}`,
      });
    },
    onLca: (lcaIdx) => {
      phase = '完成 / Done';
      const id = bl.nodes[lcaIdx]!;
      roles.set(id, 'final');
      snapshot({
        zh: `LCA = ${id}`,
        en: `LCA = ${id}`,
      });
    },
  });

  // 终态：清掉 compare/swap，只保留 LCA 的 final
  roles.clear();
  if (result) {
    roles.set(result, 'final');
    roles.set(u, 'frontier');
    roles.set(v, 'frontier');
  }
  rec
    .begin({
      zh: `LCA(${u}, ${v}) = ${result}`,
      en: `LCA(${u}, ${v}) = ${result}`,
    })
    .setTree(markRoles(vizRoot, roles))
    .setAux([
      { label: 'LCA', value: String(result), role: 'final' },
      { label: 'log', value: String(bl.log), role: 'default' },
      { label: '节点数', value: String(bl.nodes.length), role: 'default' },
    ])
    .commit();

  return rec.build();
}
