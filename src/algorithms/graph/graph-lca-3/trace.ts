// =============================================================================
// LCA · 录制
import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LCA, type TreeInput } from './impl.ts';

export const DEFAULT_INPUT: TreeInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '2', to: '5' },
    { from: '3', to: '6' },
    { from: '3', to: '7' },
  ],
  root: '1',
};

const PARENT: Record<string, string | null> = {
  '1': null,
  '2': '1',
  '3': '1',
  '4': '2',
  '5': '2',
  '6': '3',
  '7': '3',
};

function toTree(highlight: string | null, root = '1'): TreeNode {
  const childrenOf = (p: string): string[] => Object.keys(PARENT).filter((k) => PARENT[k] === p);
  const build = (id: string): TreeNode => {
    const kids = childrenOf(id);
    return {
      id: `n-${id}`,
      value: id,
      role: (id === highlight ? 'swap' : 'default') as BarRole,
      children: kids.length ? kids.map(build) : undefined,
    };
  };
  return build(root);
}

export function buildTrace(
  input: TreeInput = DEFAULT_INPUT,
  query: { u: string; v: string } = { u: '4', v: '6' },
): Frame[] {
  const rec = new TraceRecorder();
  const lca = new LCA(input);
  let active: string | null = null;

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setTree(toTree(active)).commit();
  };

  snap({ zh: `查询 LCA(${query.u}, ${query.v})`, en: `Query LCA(${query.u}, ${query.v})` });
  active = query.u;
  snap({ zh: `u = ${query.u}`, en: `u = ${query.u}` });
  active = query.v;
  snap({ zh: `v = ${query.v}`, en: `v = ${query.v}` });

  const ans = lca.query(query.u, query.v);
  active = ans;
  snap({ zh: `LCA = ${ans}`, en: `LCA = ${ans}` });

  rec
    .begin({ zh: `LCA(${query.u}, ${query.v}) = ${ans}`, en: `LCA = ${ans}` })
    .setTree(toTree(ans))
    .setAux([{ label: 'LCA', value: ans, role: 'final' }])
    .commit();

  return rec.build();
}
